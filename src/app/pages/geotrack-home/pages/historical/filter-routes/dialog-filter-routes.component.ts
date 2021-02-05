import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {ModalController, NavParams, ToastController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {Device, IncomingRouteDevice, InformationDeviceRoutePoint, WayRoutePoint} from '../../../../../models/device/device';
import {GroupGeotrack} from '../../../../../models/geotrack-group/GeotrackGroup';
import {IotDeviceGeotrackService} from '../../../../../services/io-device-geotrack/iot-device-geotrack.service';
import {IotGroupsGeotrackService} from '../../../../../services/io-groups-geotrack/iot-groups-geotrack.service';
import {Global} from '../../../../../models/global/global';
import {ToastService} from '../../../../../services/toast/toast.service';
import {LocalStorageService} from '../../../../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-automplace-place',
  templateUrl: './dialog-filter-routes.component.html',
  styleUrls: ['./dialog-filter-routes.component.scss'],
})
export class DialogFilterRoutesComponent implements OnInit {
  //-----Error
  // public error: boolean;
  // public error_message: string;

  public lat: number;
  public lng: number;
  public zoom: number;
  /**
   * preload
   */
  public preload: boolean;

  public icon: any;
  public listDevices: Device[] = [];
  // public listDevicesDisplayed: Device[] = [];
  public loadingMoreGroups: boolean;
  public loadingMoreDevices: boolean;
  /**
   * Lista de grupos
   */
  public listGroups: GroupGeotrack[] = [];
  public limitGroups = 10;
  public limitDevices = 30;
  public pageIndexCurrent = 0;
  public preloadDevices: boolean;
  public loadingGroupsOnLoad: boolean;
  public loadingDevicesOnLoad: boolean;
  public formControlCurrentGroup = new FormControl('', [
    Validators.required
  ]);
  public formControlCurrentDevice = new FormControl('', [
    Validators.required
  ]);
  public lastResponseGroups: any;
  public lastResponseDevices: any;
  public readonly valueRadioGroup = 'group';
  public readonly valueRadioDevice = 'device';
  public radioGroupPosition: 'group' | 'device' = this.valueRadioGroup;
  public formControlDateSince = new FormControl('', [
    Validators.required
  ]);
  public formControlDateUntil = new FormControl('', [
    Validators.required
  ]);
  public loadingRoutes: boolean;
  public readonly heightIcon = 30;
  public readonly widthIcon = 30;
  public errorLoadDevice: string;
  private maxPointsOfRoute = 25;
  listDevicesDisplayed: Device[] = [];

  constructor(private dialogRef: ModalController,
              private translate: TranslateService,
              private iotDeviceGeotrackService: IotDeviceGeotrackService,
              private iotGroupGeotrackService: IotGroupsGeotrackService,
              private toastService: ToastService,
              private modalController: ModalController,
              public localStorageService: LocalStorageService,
              private navParams: NavParams,) {
    this.listDevicesDisplayed = iotDeviceGeotrackService.listDevicesDisplayed;
    this.changeGroupsOfOrganization();
  }

  ngOnInit() {}

  /**
   * mostrar mas grupos a medidia que se hace scroll en select
   */
  moreGroups() {
    this.changeGroupsOfOrganization(true);
  }

  /**
   * mostrar mas dispositvios a medidia que se hace scroll en select
   */
  moreDevices() {
    this.changeDevicesOfOrganization(true);
  }

  changeGroup() {
    this.listDevices.splice(0, this.listDevices.length);
    this.listDevices.push(...this.formControlCurrentGroup.value.devices_group);
    this.formControlCurrentDevice.setValue(this.listDevices[0]);
  }

  /**
   * Buscar grupos y actualizar la tabla
   */
  changeGroupsOfOrganization(loadMore?: boolean) {
    this.formControlCurrentGroup.reset();
    this.formControlCurrentDevice.reset();
    this.listGroups = this.listGroups.splice(0, this.listGroups.length);
    // this.error = false;
    this.errorLoadDevice = undefined;
    if (!this.loadingMoreGroups) {
      if (!loadMore) {
        this.pageIndexCurrent = 0;
        this.listGroups.splice(0, this.listGroups.length);
        this.listDevices.splice(0, this.listDevices.length);
        this.preloadDevices = true;
        this.preload = true;
      } else {
        this.pageIndexCurrent++;
        this.loadingMoreGroups = true;
      }
      const offset = this.pageIndexCurrent * this.limitGroups;
      const idOrganization = Global.organization_id;
      this.iotGroupGeotrackService.getIotGroupsGeoTrackByOrganizationId(idOrganization, offset, this.limitGroups).subscribe(
        value => {
          this.listGroups.push(...value.results);
          this.lastResponseGroups = value;
          // if (!this.lastResponseGroups.previous) {
          //   this.formControlCurrentDevice.setValue(this.listGroups[0]);
          // }
          if (this.lastResponseGroups.next) {
            this.moreGroups();
            this.loadingGroupsOnLoad = true;
          } else {
            this.loadingGroupsOnLoad = false;
          }
          this.preloadDevices = false;
          this.loadingMoreGroups = false;
          this.preload = false;
        },
        error => {
          this.preloadDevices = false;
          this.loadingMoreGroups = false;
          // this.error = true;
          this.preload = false;
          this.toastService.presentToastError(this.translate.instant('geo.groups.devices.error_load'));
        }
      );
    }
  }

  /**
   * Buscar dispositivos y actualizar la tabla
   */
  changeDevicesOfOrganization(loadMore?: boolean) {
    this.formControlCurrentDevice.reset();
    this.listDevices = this.listDevices.splice(0, this.listDevices.length);
    // this.error = false;
    this.errorLoadDevice = undefined;
    if (!this.loadingMoreDevices) {
      if (!loadMore) {
        this.pageIndexCurrent = 0;
        this.listDevices.splice(0, this.listDevices.length);
        this.preloadDevices = true;
        this.preload = true;
      } else {
        this.pageIndexCurrent++;
        this.loadingMoreDevices = true;
      }
      const offset = this.pageIndexCurrent * this.limitDevices;
      const idOrganization = Global.organization_id;
      this.iotDeviceGeotrackService.getDevicesOfUser(this.localStorageService.getStorageUser().id, this.limitDevices, offset).subscribe(
        value => {
          console.log(value.results);
          this.listDevices.push(...value.results);
          this.lastResponseDevices = value;
          if (this.lastResponseDevices.next) {
            this.moreDevices();
            this.loadingDevicesOnLoad = true;
          } else {
            this.loadingDevicesOnLoad = false;
          }
          this.preloadDevices = false;
          this.loadingMoreDevices = false;
          this.preload = false;
        },
        error => {
          this.preloadDevices = false;
          this.loadingMoreDevices = false;
          // this.error = true;
          this.preload = false;
          this.toastService.presentToastError(this.translate.instant('geo.groups.devices.error_load'));
        }
      );
    }
  }

  showRoutes() {
    this.errorLoadDevice = undefined;
    if (!this.isWrongDates() && this.formControlCurrentDevice.valid && this.formControlDateSince.valid && this.formControlDateUntil.valid) {
      if (this.radioGroupPosition === this.valueRadioGroup && !this.formControlCurrentGroup.valid) {
        return;
      }
      const device = this.formControlCurrentDevice.value;
      // const indexDevice = this.listDevicesDisplayed.findIndex(d => d.id === device.id);
      // if (indexDevice !== -1) {
      //   this.errorLoadDevice = this.translate.instant('geo.historical.device_already_displayed');
      //   return;
      // }
      this.loadingRoutes = true;
      const dateSince = new Date(Date.parse(this.formControlDateSince.value));
      const dateUntil = new Date(Date.parse(this.formControlDateUntil.value));
      const body = {
        imei: device.imei,
        date_range: [this.getFormatOfDate(dateSince), this.getFormatOfDate(dateUntil)],
        event: 1
      };
      this.iotDeviceGeotrackService.getRoutesMapForDeviceId(body).subscribe(
        (route: any[]) => {
          console.log(route);
          if (route?.length > 0) {
            route.sort((p1, p2) => p1.specific_time.toString().localeCompare(p2.specific_time.toString()));
            device.historicalRoutes = {
              routeData: [{
                points: route.length,
                specificTimeOrigin: route[0].specific_time,
                specificTimeFinish: route[route.length - 1].specific_time
              }],
              incomingRouteDevice: []
            };
            console.log(device.historicalRoutes);
            for (let i = 0; i < route.length - 1; i += (this.maxPointsOfRoute - 1)) {
              console.log(route.length);
              const limit = (i + this.maxPointsOfRoute > route.length) ? route.length : i + this.maxPointsOfRoute;
              console.log(i, limit);
              const originPoint: InformationDeviceRoutePoint = {
                lat: route[i].lat,
                lng: route[i].long
              };
              const destinationPoint: InformationDeviceRoutePoint = {
                lat: route[limit - 1].lat,
                lng: route[limit - 1].long
              };
              console.log(route);
              const wayPoints: WayRoutePoint[] = route.slice(i, limit).map(p => ({
                location: {
                  lat: p.lat,
                  lng: p.long
                },
              }));
              console.log(route);
              const incomingRouteDevice: IncomingRouteDevice = {
                originPoint,
                destinationPoint,
                // @ts-ignore
                wayPoints
              };
              device.historicalRoutes.incomingRouteDevice.push(incomingRouteDevice);
              console.log(wayPoints);
              console.log(incomingRouteDevice);
              // device.listInfoDevice = route.map(p => ({
              //   lat: p.lat,
              //   lng: p.long,
              //   specificTime: p.specific_time
            }
            // }));
            this.listDevicesDisplayed.push(device);
            // this.listDevicesDisplayed.push(JSON.parse(JSON.stringify(device)));
            // this.listDevicesDisplayed.push(JSON.parse(JSON.stringify(device)));
            // this.listDevicesDisplayed.push(JSON.parse(JSON.stringify(device)));
            // this.listDevicesDisplayed.push(JSON.parse(JSON.stringify(device)));
            console.log(device.historicalRoutes);
          } else {
            this.errorLoadDevice = this.translate.instant('geo.historical.device_not_routes');
          }
          this.loadingRoutes = false;
        }, error => {
          this.loadingRoutes = false;
        }
      );
    } else {
      this.formControlCurrentDevice.markAsTouched();
      this.formControlCurrentGroup.markAsTouched();
      this.formControlDateSince.markAsTouched();
      this.formControlDateUntil.markAsTouched();
    }
  }

  getFormatOfDate(date: Date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return date.getFullYear().toString() + (month < 10 ? '0' + month.toString() : month.toString()) + (day < 10 ? '0' + day.toString() : day.toString());
  }

  isWrongDates() {
    if (this.formControlDateSince.valid && this.formControlDateUntil.valid) {
      const dateSince = new Date(Date.parse(this.formControlDateSince.value));
      const dateUntil = new Date(Date.parse(this.formControlDateUntil.value));
      if (dateUntil.getTime() < dateSince.getTime()) {
        return true;
      }
    }
    return false;
  }

  removeDevice(device: Device) {
    const indexDevice = this.listDevicesDisplayed.findIndex(d => d.id === device.id);
    if (indexDevice !== -1) {
      this.listDevicesDisplayed.splice(indexDevice, 1);
    }
  }

  getMinDateRoute(device: Device) {
    return this.getDateFormatOfSpecificTime(device.historicalRoutes.routeData[0].specificTimeOrigin);
  }

  getMaxDateRoute(device: Device) {
    return this.getDateFormatOfSpecificTime(device.historicalRoutes.routeData[device.historicalRoutes.routeData.length - 1].specificTimeFinish);
  }

  private getDateFormatOfSpecificTime(specificTime: string) {
    return specificTime.substr(6, 2) + '/' + specificTime.substr(4, 2) + '/' + specificTime.substr(0, 4);
  }

  showInMap() {
    this.modalController.dismiss();
  }
}
