import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {IotGroupsGeotrackService} from '../../../../../services/io-groups-geotrack/iot-groups-geotrack.service';
import {Device, Geofence, IncomingRouteDevice, InformationDeviceRoutePoint, WayRoutePoint} from '../../../../../models/device/device';
import {IotDeviceGeotrackService} from '../../../../../services/io-device-geotrack/iot-device-geotrack.service';
import {OrganizationService} from '../../../../../services/organization/organization.service';
import {FormControl, Validators} from '@angular/forms';
import {ServiceGeotrack, ServiceGeotrackEnum} from '../../../../../models/service-geotrack/ServiceGeotrack';
import {CallGoogleServicesService} from '../../../../../services/callGoogleServices/call-google-services.service';
import {Point, Route} from '../../../../../models/geocerca/Geocerca';
import {DialogDistanceMatrixComponent} from './route-distance-matrix/dialog-distance-matrix.component';
import {DialogDirectionAdvancedComponent} from './route-direction-advanced/dialog-direction-advanced.component';
import {ToastService} from '../../../../../services/toast/toast.service';
import {ModalController} from '@ionic/angular';
import {DialogAutocompletePlacePlaceComponent} from './automplace-place/dialog-autocomplete-place-place.component';

const SERVER_URL = 'wss://cdg5lrjp0b.execute-api.us-east-1.amazonaws.com/dev';

@Component({
  selector: 'app-settings',
  templateUrl: './map-group-view-devices.component.html',
  styleUrls: ['./map-group-view-devices.component.scss']
})
export class MapGroupViewDevicesComponent implements OnInit {
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    if (this.idGroup != null || this.idGroup != undefined) {
      this.myWebSocket.unsubscribe();
    }
  }
  //-----Error
  // public error: boolean;
  // public error_message: string;

  public lat: number;
  public lng: number;
  public zoom: number;
  /**
   * Id del dispositivo
   */
  public idDevice: any;
  /**
   * Id del dispositivo
   */
  private idGroup: any;
  /**
   * Id del dispositivo
   */
  private idOrganization: any;
  // /**
  //  * Disppositivio full
  //  */
  // public group: any;
  public isConnectionEstablished = false;
  /**
   * preload
   */
  public preload: boolean;
  public preload_socket: boolean;

  public icon: any;
  /**
   * Socket
   */
  private myWebSocket: WebSocketSubject<any> = webSocket(SERVER_URL);
  /**
   * Id de la conexion
   */
  public id_connection: string;
  public listDevices: Device[] = [];
  private listCoordinates: [];
  // private listImeis: IncomingInformationDevice[] = [];
  public readonly heightIcon = 30;
  public readonly widthIcon = 30;
  public readonly heightIconSmall = 20;
  public readonly widthIconSmall = 20;
  private limitPageOrganization = 50;
  private indexPageOrganization = 0;
  public deviceSelected: Device;
  public readonly statusEnableDevice = 2;
  public readonly statusDisableDevice = 1;
  private maxPointsOfRoute = 25;
  public marketOptions = {
    origin: {
      icon: '',
    },
    destination: {
      icon: '',
    },
    waypoints: {
      icon: '',
    }
  };
  // public readonly valueRadioMarkPoints = 'markPoints';
  public readonly valueRadioCurrentPosition = 'currentPosition';
  public readonly valueRadioManual = 'manual';
  public radioGroupPosition: 'markPoints' | 'currentPosition' | 'manual' = this.valueRadioManual;
  public formControlCurrentSpeed: FormControl = new FormControl('',
    [Validators.minLength(1), Validators.maxLength(20), Validators.pattern('[-]?[0-9]+(\\.[0-9]+)?$')]
  );
  public listServiceRoutes: ServiceGeotrack[];
  public listServicePlaces: ServiceGeotrack[];
  public grey: string = 'grey';
  public defaultCurrentValueSliderRadius = 1500;
  public currentValueSliderRadius = this.defaultCurrentValueSliderRadius;
  public minSlider = 1;
  public maxSlider = 5000;
  public formatSliderThumbLabel = (value: number) => value + 'm';
  public longitudClick: number;
  public latitudClick: number;
  public googleServicePlaceInit: Point;
  public googleServicePlaceFinish: Point;
  public showButtonsServicesRoutes = false;
  public showButtonsServicesPlaces = false;
  public listNearPlaces: any;
  public nearestRoad: Point;
  public routeDistanceAdvanced: IncomingRouteDevice[];
  public manualGeofence: Geofence;
  public minimize: boolean;
  public calculateDistanceInRoute: boolean;
  public markInitPoint: boolean;
  public markFinishPoint: boolean;
  public listMapOptions: MapOption[];
  mapOptionSelected: number;
  formControlAutocompletePlace: FormControl = new FormControl('', [Validators.maxLength(50)]);
  listAutocompletePlaces: any = [];
  preloadFindPlace: boolean;
  findPlaceDetails: any;
  showFindPLace: boolean;

  constructor(
    private translate: TranslateService,
    private iotDeviceGeotrackService: IotDeviceGeotrackService,
    private iotGroupGeotrackService: IotGroupsGeotrackService,
    private organizationService: OrganizationService,
    private activatedRoute: ActivatedRoute,
    private callGoogleServices: CallGoogleServicesService,
    private iotDeviceGeoTrack: IotDeviceGeotrackService,
    public dialog: ModalController,
    private toastService: ToastService
  ) {
    this.idDevice = this.activatedRoute.snapshot.paramMap.get('idDevice');
    this.idOrganization = this.activatedRoute.snapshot.paramMap.get('idOrganization');
    this.idGroup = this.activatedRoute.snapshot.paramMap.get('idGroup');
    this.lat = 5;
    this.lng = -73;
    this.zoom = 5;
    this.preload = true;
    this.preload_socket = true;
    this.minimize = true;
    this.calculateDistanceInRoute = false;
    this.fillGoogleServices();
    this.fillMapOptions();
    // if (this.idDevice || this.idOrganization) {
    //   this.listDevices = [];
    // }


    // this.callGoogleServices.getPostiion().subscribe(
    //   value => {
    //     console.log(value);
    //   }
    // );
  }

  fillMapOptions() {
    // this.mapOptionSelected = 0;
    this.listMapOptions = [
      {name: this.translate.instant('geo.common.map.calculateDistance'), urlImg: 'directions'},
      {name: this.translate.instant('geo.common.map.place'), urlImg: 'pin_drop'},
    ];
  }

  fillGoogleServices() {
    this.listServiceRoutes = [
      {name: this.translate.instant('geo.common.map.services.directions_advance'), typeService: ServiceGeotrackEnum.DIRECTION_ADVANCED, color: 'blue'},
      {name: this.translate.instant('geo.common.map.services.distance_matrix_advance'), typeService: ServiceGeotrackEnum.DISTANCE_MATRIX_ADVANCE, color: 'blue'},
      // {name: this.translate.instant('geo.common.map.services.roads_route_traveler'), typeService: ServiceGeotrackEnum.ROADS_ROUTE_TRAVELER, color: 'blue'},
      // {name: this.translate.instant('geo.common.map.services.roads_nearest_road'), typeService: ServiceGeotrackEnum.ROADS_NEAREST_ROAD, color: 'blue'},
      // {name: this.translate.instant('geo.common.map.services.roads_speed_limits'), typeService: ServiceGeotrackEnum.ROADS_SPEED_LIMITS, color: 'blue'},
    ];
    this.listServicePlaces = [
      {name: this.translate.instant('geo.common.map.services.Autocomplete'), typeService: ServiceGeotrackEnum.AUTOCOMPLETE, color: 'blue'},
      // {name: this.translate.instant('geo.common.map.services.Geolocation'), typeService: ServiceGeotrackEnum.GEOLOCATION, color: 'blue'},
    ];
  }

  ngOnInit(): void {
    // this.loadDevice();
    this.startConnection();
  }

  /**
   * Conexion del socket
   */
  startConnection() {
    this.myWebSocket.next(({'action': 'getIdConnect'}));
    this.myWebSocket.subscribe(
      msg => {
        console.log(msg);
        if (!this.isConnectionEstablished) {
          this.id_connection = msg.connectionId;
          this.preload_socket = false;
          this.loadDevices();
          this.registerSocketConnection();
          this.isConnectionEstablished = true;
        } else {
          const device: Device = this.listDevices.find(i => i.imei == msg.data.imei);
          if (device) {
            const infoDevice: InformationDeviceRoutePoint = {
              lat: msg.data.lat,
              lng: msg.data.long,
              battery: msg.data.bat,
            };
            // if (!device.listInfoDevice) {
            //   device.listInfoDevice = [];
            // }
            const lastDeviceRoute = device.realTimePints[device.realTimePints.length - 1];
            if (!lastDeviceRoute) {
              const incomingRouteDevice: IncomingRouteDevice = {
                originPoint: infoDevice,
                destinationPoint: infoDevice,
                wayPoints: []
              };
              device.realTimePints.push(incomingRouteDevice);
            } else if (lastDeviceRoute.wayPoints.length >= this.maxPointsOfRoute - 2) {
              const incomingRouteDevice: IncomingRouteDevice = {
                originPoint: lastDeviceRoute.destinationPoint,
                destinationPoint: infoDevice,
                wayPoints: []
              };
              device.realTimePints.push(incomingRouteDevice);
            } else {
              if (lastDeviceRoute.originPoint !== lastDeviceRoute.destinationPoint) {
                lastDeviceRoute.wayPoints.push({location: lastDeviceRoute.destinationPoint});
              }
              lastDeviceRoute.destinationPoint = infoDevice;
            }
            device.listInfoDevice.push(infoDevice);
          }
          this.lat = msg.data.lat;
          this.lng = msg.data.long;
          this.zoom = 11;
        }
      },
      // Called if WebSocket API signals some kind of error
      err => console.log(err),
      // Called when connection is closed (for whatever reason)
      () => {
        //ACA VA SERVICIO ELIMINAR COENXION
      }
    );
  }

  /**
   * validate devices
   */
  private loadDevices() {
    if (this.idDevice) {
      this.loadDevice();
    } else if (this.idGroup) {
      this.loadGroup();
    } else if (this.idOrganization) {
      this.loadOrganization();
    }
  }

  /**
   * get device
   */
  loadDevice() {
    this.iotDeviceGeotrackService.getIotDevicesGeoTrackByID(this.idDevice).subscribe(
      res => {
        const device: Device = res.body;
        device.realTimePints = [];
        device.listInfoDevice = [];
        this.listDevices.push(device);
        console.log(device);
        this.preload = false;
        this.registerSocketConnectionDevice();
        //
        // if (device) {
        //   device.incomingInformationDevice = {
        //     lat: 0,
        //     lng: 0,
        //     // battery: 45,
        //   };
        // }
        //
      }, err => {
        // this.error = true;
        this.preload = false;
        this.toastService.presentToastError(this.translate.instant('geo.devices.error_get_device'));
      });
  }

  /**
   * get group
   */
  private loadGroup() {
    this.iotGroupGeotrackService.getIotDevicesGeoTrackByID(this.idGroup).subscribe(res => {
      // this.listDevices = this.group.devices_group;
      const devices: any[] = res.body.devices_group;
      for (const device of devices) {
        device.realTimePints = [];
        device.listInfoDevice = [];
      }
      this.listDevices.push(...devices);
      this.preload = false;
      //
      // if (devices) {
      //   devices.map(d => {
      //     d.incomingInformationDevice = {
      //       lat: 0,
      //       lng: 0,
      //       battery: 100,
      //     };
      //     return d;
      //   });
      // }
      //
      // this.registerSocketConnection();
    }, err => {
      // this.error = true;
      this.preload = false;
      this.toastService.presentToastError(this.translate.instant('geo.devices.error_get_device'));
    });
  }

  /**
   * get organization
   */
  private loadOrganization() {
    const offset = this.indexPageOrganization * this.limitPageOrganization;
    this.iotDeviceGeotrackService.getAllDevicesGeoTrackByOrganizationId(this.idOrganization, offset, this.limitPageOrganization).subscribe(res => {
      const devices: any[] = res.results;
      for (const device of devices) {
        device.realTimePints = [];
        device.listInfoDevice = [];
      }
      this.listDevices.push(...devices);
      this.preload = false;
      if (res.next) {
        this.indexPageOrganization++;
        this.loadOrganization();
      }
      // this.registerSocketConnectionOrganization();
      //
      // if (devices) {
      //   devices.map(d => {
      //     d.incomingInformationDevice = {
      //       lat: 0,
      //       lng: 0,
      //       battery: 100,
      //     };
      //     return d;
      //   });
      // }
      //
    }, err => {
      // this.error = true;
      this.preload = false;
      this.toastService.presentToastError(this.translate.instant('geo.devices.error_get_device'));
    });
  }

  /**
   * Registra coenexion del socket
   */
  registerSocketConnection() {
    if (this.idGroup) {
      this.registerSocketConnectionGroup();
    } else if (this.idOrganization) {
      // this.registerSocketConnectionOrganization();
    }
  }

  private registerSocketConnectionDevice() {
    const datConnection = {
      imei: this.listDevices[0].imei,
      connectionId: this.id_connection
    };
    this.iotDeviceGeotrackService.registerSocket(datConnection).subscribe(res => {
      }, err => {
      }
    );
  }

  private registerSocketConnectionGroup() {
    const datConnection = {
      connectionId: this.id_connection
    };
    this.iotGroupGeotrackService.registerSocket(this.idGroup, datConnection).subscribe(
      res => {
      },
      err => {
      }
    );
  }

  // private registerSocketConnectionOrganization() {
  //   const datConnection = {
  //     connectionId: this.id_connection
  //   };
  //   this.organizationService.registerSocket(this.idOrganization, datConnection).subscribe(res => {
  //     }, err => {
  //     }
  //   );
  // }

  testChangeCoordinate() {
    console.log(this.listDevices);
    const device = this.listDevices[parseInt((Math.random() * this.listDevices.length).toString())];
    const infoDevice = {
      lat: (Math.random() + 5),
      lng: (Math.random() - 73),
      // battery: 100,
    };
    if (!device.realTimePints) {
      device.realTimePints = [];
    }
    const lastDeviceRoute = device.realTimePints[device.realTimePints.length - 1];
    console.log(device.realTimePints);
    if (!lastDeviceRoute) {
      const incomingRouteDevice: IncomingRouteDevice = {
        originPoint: infoDevice,
        destinationPoint: infoDevice,
        wayPoints: []
      };
      device.realTimePints.push(incomingRouteDevice);
      console.log(incomingRouteDevice);
    } else if (lastDeviceRoute.wayPoints.length >= this.maxPointsOfRoute - 2) {
      const incomingRouteDevice: IncomingRouteDevice = {
        originPoint: lastDeviceRoute.destinationPoint,
        destinationPoint: infoDevice,
        wayPoints: []
      };
      device.realTimePints.push(incomingRouteDevice);
    } else {
      if (lastDeviceRoute.originPoint !== lastDeviceRoute.destinationPoint) {
        lastDeviceRoute.wayPoints.push({location: lastDeviceRoute.destinationPoint});
      }
      lastDeviceRoute.destinationPoint = infoDevice;
    }
    device.listInfoDevice.push(infoDevice);
  }

  getIconBattery(battery: number) {
    if (battery !== undefined) {
      if (battery >= 34 && battery <= 66) {
        return 'fas fa-battery-half map-icon-info';
      } else if (battery <= 33) {
        return 'fas fa-battery-quarter color-red map-icon-info';
      } else {
        return 'fas fa-battery-full color-green map-icon-info';
      }
    }
    return 'fas fa-battery-empty color-dark-gray map-icon-info';
  }

  mapPointClick($event: MouseEvent | any) {
    if (this.markInitPoint) {
      this.googleServicePlaceInit = {
        lat: $event.coords.lat,
        lng: $event.coords.lng,
      };
    } else if (this.markFinishPoint) {
      this.googleServicePlaceFinish = {
        lat: $event.coords.lat,
        lng: $event.coords.lng,
      };
    } else {
      // if (this.radioGroupPosition === this.valueRadioManual && this.mapOptionSelected === 0) {
      //   this.latitudClick = $event.coords.lat;
      //   this.longitudClick = $event.coords.lng;
      //   this.loadNearPlaces();
      // }
    }
  }

  mapPointRightClick($event: MouseEvent | any) {
    // if (this.deviceSelected && this.radioGroupPosition === this.valueRadioManual) {
    //   // this.latitudClick = $event.coords.lat;
    //   // this.longitudClick = $event.coords.lng;
    // } else if (this.radioGroupPosition === this.valueRadioMarkPoints) {
    //   this.googleServicePlaceFinish = {
    //     lat: $event.coords.lat,
    //     lng: $event.coords.lng,
    //   };
    // }
  }

  activateGeocercaDevice() {
    const lastCoordinate = this.deviceSelected.listInfoDevice[this.deviceSelected.listInfoDevice.length - 1];
    this.deviceSelected.geofence = [{
      lat: lastCoordinate.lat,
      long: lastCoordinate.lng,
      radius: this.currentValueSliderRadius
    }];
    const body = {
      geofence: this.deviceSelected.geofence,
    };
    this.iotDeviceGeoTrack.editDevice(this.deviceSelected.id, body).subscribe(
      value => {
        console.log(value);
      }
    );
    this.loadNearPlaces();
  }

  deactivateGeocercaDevice() {
    this.listNearPlaces = [];
    this.deviceSelected.geofence = [];
    const body = {
      geofence: this.deviceSelected.geofence,
    };
    this.iotDeviceGeoTrack.editDevice(this.deviceSelected.id, body).subscribe(
      value => {
        console.log(value);
      }
    );
  }

  activateSpeedDevice() {
    this.deviceSelected.velocity = {isActive: true};
    const body = {
      velocity: this.deviceSelected.velocity
    };
    this.iotDeviceGeoTrack.editDevice(this.deviceSelected.id, body).subscribe(
      value => {
        console.log(value);
      }
    );
  }

  deactivateSpeedDevice() {
    this.deviceSelected.velocity = {isActive: false};
    const body = {
      velocity: this.deviceSelected.velocity
    };
    this.iotDeviceGeoTrack.editDevice(this.deviceSelected.id, body).subscribe(
      value => {
        console.log(value);
      }
    );
  }

  changeCurrentPointGeocerca() {
    // if (!this.deviceSelected.geofence) {
    //   this.deviceSelected.geofence = [];
    // }
    // this.deviceSelected.geofence.splice(0, this.deviceSelected.geofence.length);
    // const lastCoordinate = this.deviceSelected.listInfoDevice[this.deviceSelected.listInfoDevice.length - 1];
    // this.deviceSelected.geofence.push({
    //     lat: lastCoordinate.lat,
    //     long: lastCoordinate.lng,
    //     radius: this.currentValueSliderRadius
    //   });
    this.listNearPlaces = [];
    if (this.deviceSelected) {
      if (this.deviceSelected.geofence && this.deviceSelected.geofence.length > 0) {
        this.currentValueSliderRadius = this.deviceSelected.geofence[0].radius;
        this.loadNearPlaces();
      }
    }
    this.radioGroupPosition = this.valueRadioCurrentPosition;
  }

  changeManualGeocerca() {
    this.manualGeofence = {
      lat: this.latitudClick,
      long: this.longitudClick,
      radius: this.currentValueSliderRadius
    };
    this.radioGroupPosition = this.valueRadioManual;
    this.loadNearPlaces();
    // if (!this.deviceSelected.geofence) {
    //   this.deviceSelected.geofence = [];
    // }
    // this.deviceSelected.geofence.splice(0, this.deviceSelected.geofence.length);
    // this.deviceSelected.geofence.push({
    //   lat: this.latitudClick,
    //   long: this.longitudClick,
    //   radius: this.currentValueSliderRadius
    // });
  }

  /**
   * Mensaje de error kilometraje
   */
  getErrorMessageMileage() {
    return this.formControlCurrentSpeed.hasError('required')
      ? 'Este campo es obligatorio'
      : this.formControlCurrentSpeed.hasError('minlength')
        ? 'Longitud mínima de 1 caracteres'
        : this.formControlCurrentSpeed.hasError('maxlength')
          ? 'Longitud máxima de 20 caracteres'
          : this.formControlCurrentSpeed.hasError('pattern')
            ? 'Solo se permiten caracteres numéricos'
            : '';
  }

  changeSlider() {
    console.log('slide');
    console.log(this.deviceSelected);
    const lastCoordinate = this.deviceSelected.listInfoDevice[this.deviceSelected.listInfoDevice.length - 1];
    const point: Geofence = {
      lat: lastCoordinate.lat,
      long: lastCoordinate.lng,
      radius: this.currentValueSliderRadius
    };
    if (this.radioGroupPosition === this.valueRadioCurrentPosition) {
      this.deviceSelected.geofence = [point];
      const body = {
        geofence: this.deviceSelected.geofence,
      };
      this.iotDeviceGeoTrack.editDevice(this.deviceSelected.id, body).subscribe(
        value => {
          console.log(value);
        }
      );
    } else {
      this.manualGeofence = point;
    }
    this.loadNearPlaces();
  }

  loadNearPlaces() {
    this.listNearPlaces = [];
    const point: Geofence = {
      lat: this.radioGroupPosition === this.valueRadioCurrentPosition ? this.deviceSelected.listInfoDevice[this.deviceSelected.listInfoDevice.length - 1].lat : this.latitudClick,
      long: this.radioGroupPosition === this.valueRadioCurrentPosition ? this.deviceSelected.listInfoDevice[this.deviceSelected.listInfoDevice.length - 1].lng : this.longitudClick,
      radius: this.currentValueSliderRadius
    };
    this.callGoogleServices.findNearPlace(point).subscribe(
      value => {
        console.log(value);
        // @ts-ignore
        this.listNearPlaces = value.results;
        this.preload = false;
      }
    );
  }

  getGeocercaLatitude() {
    if (this.deviceSelected && this.radioGroupPosition === this.valueRadioCurrentPosition) {
      return this.deviceSelected.listInfoDevice[this.deviceSelected.listInfoDevice.length - 1].lat;
    } else if (this.radioGroupPosition === this.valueRadioManual) {
      return this.latitudClick;
    }
  }

  getGeocercaLongitude() {
    if (this.deviceSelected && this.radioGroupPosition === this.valueRadioCurrentPosition) {
      return this.deviceSelected.listInfoDevice[this.deviceSelected.listInfoDevice.length - 1].lng;
    } else if (this.radioGroupPosition === this.valueRadioManual) {
      return this.longitudClick;
    }
  }

  async executeGoogleService(service: ServiceGeotrack) {
    this.markInitPoint = false;
    this.markFinishPoint = false;
    switch (service.typeService) {
      case ServiceGeotrackEnum.DIRECTION_ADVANCED:
        if (!this.googleServicePlaceInit || !this.googleServicePlaceFinish) {
          this.toastService.presentToastError(this.translate.instant('geo.common.map.select_init_finish_point'));
          return;
        }
        const routeDistanceAdvance: Route = {
          initPoint: this.googleServicePlaceInit,
          finishPoint: this.googleServicePlaceFinish,
        };
        console.log(routeDistanceAdvance);
        const dialogRefDirectionAdvanced = await this.dialog.create({
          component: DialogDirectionAdvancedComponent,
          componentProps: {
            data: routeDistanceAdvance
          }
        });
        dialogRefDirectionAdvanced.onDidDismiss().then(
          value => {
            value = value?.data;
            if (value) {
              const legs = value[0]?.legs;
              if (legs) {
                for (const leg of legs) {
                  const steps = leg.steps;
                  this.routeDistanceAdvanced = [];
                  for (let i = 0; i < steps.length - 1; i += (this.maxPointsOfRoute - 1)) {
                    console.log(steps.length);
                    const limit = (i + this.maxPointsOfRoute > steps.length) ? steps.length : i + this.maxPointsOfRoute;
                    console.log(i, limit);
                    const originPoint: InformationDeviceRoutePoint = {
                      lat: steps[i].end_location.lat,
                      lng: steps[i].end_location.lng
                    };
                    const destinationPoint: InformationDeviceRoutePoint = {
                      lat: steps[limit - 1].end_location.lat,
                      lng: steps[limit - 1].end_location.lng
                    };
                    console.log(steps);
                    const wayPoints: WayRoutePoint[] = steps.slice(i + 1, limit - 1).map(p => ({
                      location: {
                        lat: p.end_location.lat,
                        lng: p.end_location.lng
                      },
                    }));
                    console.log(steps);
                    const incomingRouteDevice: IncomingRouteDevice = {
                      originPoint,
                      destinationPoint,
                      // @ts-ignore
                      wayPoints
                    };
                    this.routeDistanceAdvanced.push(incomingRouteDevice);
                    console.log(wayPoints);
                    console.log(incomingRouteDevice);
                    // device.listInfoDevice = route.map(p => ({
                    //   lat: p.lat,
                    //   lng: p.long,
                    //   specificTime: p.specific_time
                  }
                  console.log(this.routeDistanceAdvanced);
                }
              }
            }
          }
        );
        await dialogRefDirectionAdvanced.present();
        break;
      case ServiceGeotrackEnum.DISTANCE_MATRIX_ADVANCE:
        if (!this.googleServicePlaceInit || !this.googleServicePlaceFinish) {
          this.toastService.presentToastError(this.translate.instant('geo.common.map.select_init_finish_point'));
          return;
        }
        const route: Route = {
          initPoint: this.googleServicePlaceInit,
          finishPoint: this.googleServicePlaceFinish,
        };
        const dialogRefDistanceMatrix = await this.dialog.create({
          component: DialogDistanceMatrixComponent,
          componentProps: {
            data: route
          }
        });
        await dialogRefDistanceMatrix.present();
        break;
      case ServiceGeotrackEnum.ROADS_ROUTE_TRAVELER:
        break;
      case ServiceGeotrackEnum.ROADS_NEAREST_ROAD:
        const pointNearestRoad: Geofence = {
          lat: this.radioGroupPosition === this.valueRadioCurrentPosition ? this.deviceSelected.listInfoDevice[this.deviceSelected.listInfoDevice.length - 1].lat : this.latitudClick,
          long: this.radioGroupPosition === this.valueRadioCurrentPosition ? this.deviceSelected.listInfoDevice[this.deviceSelected.listInfoDevice.length - 1].lng : this.longitudClick,
          radius: this.currentValueSliderRadius
        };
        this.callGoogleServices.getNearestRoad(pointNearestRoad).subscribe(
          (valueNearestRoad: any) => {
            console.log(valueNearestRoad);
            const snappedPoints = valueNearestRoad?.snappedPoints;
            if (snappedPoints) {
              this.nearestRoad = {
                lat: snappedPoints[0].location?.latitude,
                lng: snappedPoints[0].location?.longitude,
              };
            }
            console.log(this.nearestRoad);
          }
        );
        break;
    }
  }

  markSelectDevice(device: Device) {
    this.deviceSelected = device;
    this.loadNearPlaces();
  }

  activateDistanceInRoute() {

  }

  changeText() {
    if (this.formControlAutocompletePlace.valid) {
      const text = this.formControlAutocompletePlace.value;
      this.callGoogleServices.getPlaceAutocomplete(text).subscribe(
        value => {
          // @ts-ignore
          this.listAutocompletePlaces = value.predictions;
        }
      );
    }
  }

  choosePlace(place: any) {
    this.preloadFindPlace = true;
    this.callGoogleServices.getPlaceDetails(place.place_id).subscribe(
      value => {
        // @ts-ignore
        this.findPlaceDetails = value.result;
        console.log(value);
        this.preloadFindPlace = false;
      }
    );
  }

  /**
   * Mensaje de error NIT
   */
  getErrorMessageAutocomplete() {
    return this.formControlAutocompletePlace.hasError('required')
      ? 'Este campo es obligatorio'
      // : this.formControlTextAutocomplete.hasError('minlength')
      //   ? 'Longitud mínima de 1 cacteres'
      : this.formControlAutocompletePlace.hasError('maxlength')
        ? 'Longitud máxima de 200 cacteres'
        : this.formControlAutocompletePlace.hasError('pattern')
          ? 'Solo se permiten caracteres numéricos'
          : '';
  }

  showFindPlaceInMap() {
    this.lat = this.findPlaceDetails?.geometry?.location?.lat;
    this.lng = this.findPlaceDetails?.geometry?.location?.lng;
    this.zoom = 17;
    this.showFindPLace = true;
  }

  async openDialogAutocomplatePlace() {
    const modal = await this.dialog.create({
      component: DialogAutocompletePlacePlaceComponent,
      cssClass: 'fullscreen',
      componentProps: {
        data: 1
      }
    });
    modal.onDidDismiss().then(res => {
      if (res) {
        if (res?.data) {
          // @ts-ignore
          this.lat = res.data?.geometry?.location?.lat;
          // @ts-ignore
          this.lng = res.data?.geometry?.location?.lng;
          this.zoom = 17;
          this.showFindPLace = true;
          this.findPlaceDetails = res.data;
        }
      }
    }).catch();
    return await modal.present();
  }

  actionMarkInitPoint() {
    this.markInitPoint = !this.markInitPoint;
    this.markFinishPoint = false;
    if (this.markInitPoint) {
      this.toastService.presentToastOk(this.translate.instant('geo.common.map.mark_init_point'));
    }
  }

  actionMarkFinsihPoint() {
    this.markFinishPoint = !this.markFinishPoint;
    this.markInitPoint = false;
    if (this.markFinishPoint) {
      this.toastService.presentToastOk(this.translate.instant('geo.common.map.mark_finish_point'));
    }
  }
}

export interface MapOption {
  name: string;
  urlImg: string;
}
