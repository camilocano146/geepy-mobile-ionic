import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { ModalController, ToastController, PopoverController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SimCardService } from 'src/app/services/sim-card/sim-card.service';
import { FormControl, Validators } from '@angular/forms';
import { ExtraNumbersService } from 'src/app/services/extra-numbers/extra-numbers.service';
import { } from 'googlemaps';
import { EventSimCard } from 'src/app/models/sim-card/event';
import { SimModalSendSmsComponent } from '../sim-modal-send-sms/sim-modal-send-sms.component';
import { SimModalSeeSmsComponent } from '../sim-modal-see-sms/sim-modal-see-sms.component';
import { ServiceAccountOrganization } from 'src/app/models/service-account/service-account-organization';
import { ServiceAccountService } from 'src/app/services/service-account/service-account.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ModulesService } from 'src/app/services/modules/modules.service';

@Component({
  selector: 'sim-modal-settings',
  templateUrl: './sim-modal-settings.html',
  styleUrls: ['./sim-modal-settings.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SimModalSettings implements OnInit {

  /**
   * Info de la sim actual
   */
  @Input() sim_current: any[];
  public cupon: FormControl;
  //---------------Preloads
  public preload_simcard: boolean;
  public preload_end_point: boolean;
  public preload_connectivity: boolean;
  public preload_stats: boolean;
  public preload_events: boolean;
  public preload_maps: boolean;
  public preload_sms: boolean;
  //--------------Delete sim
  public ableToDelete: boolean;
  //--------------Simcard Data
  public current_sim_card;
  public current_endpoint;
  public current_conectivity;
  public show_details_connectivity: boolean;
  //-------------Aux variables
  public value: FormControl;
  //------------------Data stats------------------
  public stats: any;
  public lastHourActivated: boolean;
  public lastHourVolumen: number;
  public lastHourVolumenrx: number;
  public lastHourVolumentx: number;
  public monthCurrentActivated: boolean;
  public lastMonthActivated: boolean
  //---------------Eventos
  public eventList: EventSimCard[];
  //---------------SMS
  public textSMS: string;
  public cost_usd: number;
  public cost_eur: number;
  public total_eur: number;
  public total_usd: number;
  public total_cost_usd: number;
  public total_cost_eur: number;

  public listSMS: any[];

  //---------------Google Maps---------------
  public lat: number;
  public lng: number;
  private map: google.maps.Map = null;
  private heatmap: google.maps.visualization.HeatmapLayer = null;
  public showHeat: boolean;
  public noCoords: boolean;
  public isSimDeleted: boolean;
  //------Cuentas de servicio de la oirganización
  public preload_packages: boolean;
  public accounts_list: ServiceAccountOrganization[];
  public account_selected: ServiceAccountOrganization;
  //----Compra de paquete
  public final_price_usd: number;
  public final_price_eur: number;
  public validity: FormControl;
  public currency: FormControl;
  public open_section: boolean;
  //--------Permission
  public show_details: boolean;
  public show_packages: boolean;
  public show_events: boolean;
  public show_sms: boolean;
  public show_location: boolean;
  public show_settings: boolean;
  public codes_permission: string[];
  public preload_permissions: boolean;
  public interval: any;
  public step: number;

  constructor(
    private moduleService: ModulesService,
    private loadingService: LoadingService,
    private serviceAccountService: ServiceAccountService,
    public modalController: ModalController,
    private translate: TranslateService,
    private alertController: AlertController,
    public toastController: ToastController,
    private simCardService: SimCardService,
    public popoverController: PopoverController,
    private extraNumberService: ExtraNumbersService) {
      this.step = 1;
    this.cupon = new FormControl('', [Validators.minLength(8), Validators.maxLength(8)]);
    //----Permisos
    this.lastHourActivated = true;
    this.monthCurrentActivated = false;
    this.lastMonthActivated = false;
    this.showHeat = false;
    this.preload_simcard = true;
    this.preload_end_point = true;
    this.preload_connectivity = true;
    this.preload_stats = true;
    this.preload_maps = true;
    this.preload_events = true;
    this.preload_packages = true;
    this.noCoords = false;
    this.show_details_connectivity = false;
    this.cost_eur = 0.25;
    this.cost_usd = 0.30;
    this.total_cost_eur = 0;
    this.total_cost_usd = 0;
    this.total_eur = 0;
    this.total_usd = 0;
    this.listSMS = [];
    this.value = new FormControl("", [Validators.minLength(5), Validators.maxLength(30)]);
    this.validity = new FormControl('1', Validators.required);
    this.currency = new FormControl('USD', Validators.required);
    this.final_price_eur = 0;
    this.final_price_usd = 0;
    this.open_section = false;
    this.preload_permissions = true;
     //----Permisos
     this.show_details = true;
     this.show_packages = false;
     this.show_events = false;
     this.show_sms = false;
     this.show_location = false;
     this.show_settings = false;
     this.codes_permission = ['3','4','5','6','7','8'];

  }

  ngOnInit(): void {
    console.log(this.sim_current);
    this.startLoading();
   // this.getPermissions();
   //
  }

  startLoading() {
    this.getPermissions();
    this.loadingService.presentLoading().then(() => {
      this.stopLoading();
    });
  }

  stopLoading() {
    //Pregunto
    this.interval = setInterval(() => {
      if (this.preload_permissions == false &&
        this.preload_stats == false &&
        this.preload_simcard == false &&
        this.preload_end_point == false &&
        this.preload_connectivity == false &&
        this.preload_events == false &&
        this.preload_sms == false &&
        this.preload_maps == false &&
        this.preload_packages == false
        ) {
        clearInterval(this.interval);
        this.interval = null;
        this.loadingService.dismissLoading();
      }
    }, 500);
  }

  /**
   * Obtiene permisos de modulos
   */
  getPermissions() {
    const data = {
      codes: this.codes_permission
    }
    console.log(data);
    // const toast = await this.toastController.create({
    //   message: data.codes + ' asdasd',
    //   duration: 3000,
    //   color: 'success'
    // });
    // toast.present();
    console.log('asxasxasxasxasaaaaaaaaaaaaaaaaa');
    this.moduleService.getStatesModuleOrganizationPlatformVector(data).subscribe((res) => {
      // const toast = await this.toastController.create({
      //   message: ' asdasd',
      //   duration: 3000,
      //   color: 'success'
      // });
      // toast.present();
      console.log(res);
      if (res.body[0].is_active == true) {
        this.show_details = true;
      }
      if (res.body[1].is_active == true) {
        this.show_events = true;
      }
      if (res.body[2].is_active == true) {
        this.show_sms = true;
      }
      if (res.body[3].is_active == true) {
        this.show_location = true;
      }
      if (res.body[4].is_active == true) {
        this.show_settings = true;
      }
      if (res.body[5].is_active == true) {
        this.show_packages= true;
      }
      this.preload_permissions = false;
      this.viewSimStatsDetails();
      this.viewSimDetails();
      this.viewEndpointDetails();
      this.viewConnectivityDetails();
      this.getEventsSimCard();
      this.getSMSSimCard();
      this.viewLocationDetails();
      this.getServiceAccounts();
    }, err => {
      this.loadingService.dismissLoading();
      this.presentToastError(this.translate.instant("simcard.error.error_permission"));
    });

  }
  /**
   * Detectción de segmento en data
   */
  segmentChanged(event) {
    switch (event.detail.value) {
      case 'hour':
        this.lastHourActivated = true;
        this.monthCurrentActivated = false;
        this.lastMonthActivated = false;
        break;

      case 'month':
        this.lastHourActivated = false;
        this.monthCurrentActivated = true;
        this.lastMonthActivated = false;
        break;

      case 'last':
        this.lastHourActivated = false;
        this.monthCurrentActivated = false;
        this.lastMonthActivated = true;
        break;
    }
  }

  /**
   * Obtener cuentas de servicio de la org
   */
  getServiceAccounts() {
    this.serviceAccountService.getServiceAccountByOrg().subscribe(res => {
      if (res.status == 200) {
        this.accounts_list = res.body;
        for (let index = 0; index < this.accounts_list.length; index++) {
          if (+this.sim_current[4] == this.accounts_list[index].account.id) {
            this.account_selected = this.accounts_list[index];
          }
        }
        this.final_price_usd = +this.account_selected.customer_price_usd * +this.validity.value;
        this.final_price_eur = +this.account_selected.customer_price_eur * +this.validity.value;
        this.preload_packages = false;
      }
    }, err => {
      console.log(err);
    });
  }

  /**
   * Obtiene el valor a pagar del paquete
   */
  calculateNewValueToPurchase() {
    this.final_price_usd = +this.account_selected.customer_price_usd * +this.validity.value;
    this.final_price_eur = +this.account_selected.customer_price_eur * +this.validity.value;
  }
  /**
   * Abrir pestaña de comprar paquetes
   */
  openBuyPackages() {
    this.open_section = true;
  }
  /**
   * Compra de paquete
   */
  buyPackage() {
    this.loadingService.presentLoading().then(() => {
      const buy_package_data = {
        validity: this.validity.value,
        currency: this.currency.value
      }
      this.simCardService.buyPackage(this.sim_current[0], buy_package_data).subscribe(res => {
        this.presentToastOk(this.translate.instant('simcard.data.settings.package.buy_ok'));
        this.loadingService.dismissLoading();
        this.viewSimDetails();
      }, err => {
        console.log(err);
        if (err.status == 402 && err.error.detail == "Hasn't enough money") {
          this.presentToastError(this.translate.instant('simcard.data.settings.package.not_enough_money'));
        } else {
          this.presentToastError(this.translate.instant('simcard.data.settings.package.error_buy'));
        }
        this.loadingService.dismissLoading();
      });
    });
  }
  /**
     * Detalles de simcard
     */
  viewSimDetails() {
    this.simCardService.getSimDetails(this.sim_current[0]).subscribe(res => {
      this.current_sim_card = res.body;
      this.preload_simcard = false;
    }, err => {
      this.preload_simcard = false;
      this.presentToastError(this.translate.instant("simcard.error.no_details_sim"));
    });
  }
  /**
     * Detalles de simcard sin llamar otros servicios
     */
  viewSimDetailsWithoutOtherServices() {
    this.simCardService.getSimDetails(this.sim_current[0]).subscribe(res => {
      this.current_sim_card = res.body;
      this.preload_simcard = false;
    }, err => {
      this.preload_simcard = false;
      this.presentToastError(this.translate.instant("simcard.error.no_details_sim"));
    });
  }
  /**
   * Detalles de endpoint1
   */
  viewEndpointDetails() {
    this.simCardService.getEndPointDetails(this.sim_current[1]).subscribe(res => {
      this.current_endpoint = res.body;
      this.value.setValue(this.current_endpoint.name);
      this.preload_end_point = false;
    }, err => {
      this.preload_end_point = false;
      this.presentToastError(this.translate.instant("simcard.error.no_endpoint_sim"));
    });
  }
  /**
   * Detalles de endpoint sin otros servicio
   */
  viewEndpointDetailsWithoutOtherServices() {
    this.simCardService.getEndPointDetails(this.sim_current[1]).subscribe(res => {
      this.current_endpoint = res.body;
      this.value.setValue(this.current_endpoint.name);
      this.preload_end_point = false;
    }, err => {
      this.preload_end_point = false;
      this.presentToastError(this.translate.instant("simcard.error.no_endpoint_sim"));
    });
  }
  /**
   * Detalles conectividad
   */
  viewConnectivityDetails() {
    this.simCardService.getConnectivity(this.sim_current[0]).subscribe(res => {
      this.current_conectivity = res.body;
      console.log(this.current_conectivity);
      this.preload_connectivity = false;
    }, err => {
      this.preload_end_point = false;
      this.presentToastError(this.translate.instant("simcard.error.no_connectivity_sim"));
    });
  }
  /**
   * Caputra de evnto de mostrar detalles de conectividad
   */
  segmentChangedConnectivity(event) {
    switch (event.detail.value) {
      case 'hide':
        this.show_details_connectivity = false;
        break;

      case 'show':
        this.show_details_connectivity = true;
        break;
    }
  }
  /**
   * Stats de consumo
   */
  viewSimStatsDetails() {
    this.simCardService.getStats(this.sim_current[0]).subscribe(res => {
      this.stats = res.body;
      if (!this.stats.last_month) {
        const last_month = {
          data: {
            volume: 0.000,
            volume_tx: 0.000,
            volume_rx: 0.000
          }
        }
        this.stats.last_month = last_month;
      }
      this.processDataLastHour(this.stats.last_hour.data);
     
    }, err => {
      this.preload_stats = false;
      this.presentToastError(this.translate.instant("simcard.error.no_details_sim"));
    });
  }
  /**
   * Procesar la data de la ultima hora
   */
  processDataLastHour(data) {
    let rx = data.rx;
    let tx = data.tx;
    let sumatory_rx = 0;
    let sumatory_tx = 0;
    for (let i = 0; i < rx.length; i++) {
      sumatory_rx = parseFloat(rx[i][1]) + sumatory_rx;
    }
    for (let i = 0; i < tx.length; i++) {
      sumatory_tx = parseFloat(tx[i][1]) + sumatory_tx;
    }
    this.lastHourVolumen = sumatory_rx + sumatory_tx;
    this.lastHourVolumentx = sumatory_tx;
    this.lastHourVolumenrx = sumatory_rx;
    this.preload_stats = false;
  }
  /**
   * Eventos simcard
   */
  getEventsSimCard() {
    this.simCardService.getSimCardEvents(this.sim_current[0]).subscribe(res => {
      this.eventList = res.body;
      this.eventList.sort((a, b) => b.id - a.id);
      if (this.eventList.length > 50) {
        let aux: any[] = this.eventList.splice(0, 50);
        this.eventList = aux;
      }
      this.preload_events = false;

    }, err => {
      this.presentToastError(this.translate.instant("simcard.error.no_events_sim"));
    });
  }
  /**
   * Get SMS
   */
  getSMSSimCard() {
    this.simCardService.getSMSSimCard(this.sim_current[0]).subscribe(res => {
      this.listSMS = res.body;
      this.total_cost_usd = this.total_usd * this.cost_usd;
      this.total_cost_eur = this.listSMS.length * this.cost_eur;
      this.preload_sms = false;
    }, err => {
      console.log(err);
      this.presentToastError(this.translate.instant("simcard.error.no_sms_sim"));
    });
  }
  /**
   * Ver mensaje
   * @param sms 0
   */
  async openModalSeeSMS(sms: any) {
    const popover = await this.popoverController.create({
      component: SimModalSeeSmsComponent,
      componentProps: {
        'sms': sms
      },
      mode: 'ios',
    });
    return await popover.present();
  }
  /**
   * Enviar sms
   */
  async openModalSendSMS() {
    const modal = await this.modalController.create({
      component: SimModalSendSmsComponent,
      componentProps: {
        'sim_current': this.sim_current[0]
      }
    });
    modal.onDidDismiss().then(res => {
      if (res.data == "sent") {
        this.getSMSSimCard();
      }
    }).catch();
    return await modal.present();
  }

  /**
   * Método para suspender una Simcard
   */
  suspendSimCard() {
    this.simCardService.suspendSimCard(this.sim_current[0]).subscribe(res => {
      if (res.status == 200) {
        this.presentToastOk(this.translate.instant("simcard.data.suspended_ok"));
        this.preload_simcard = true;
        this.viewSimDetailsWithoutOtherServices();
        this.ngOnInit();
      }
    }, err => {
      this.presentToastError(this.translate.instant("simcard.error.suspend_error"));
    });
  }
  /**
   * Método para activar una Simcard
   */
  activatedSimCard() {
    this.simCardService.activateSimCard(this.sim_current[0]).subscribe(res => {
      if (res.status == 200) {
        this.presentToastOk(this.translate.instant("simcard.data.activated_ok"));
        this.preload_simcard = true;
        this.viewSimDetailsWithoutOtherServices();
      }
    }, err => {
      this.presentToastError(this.translate.instant("simcard.error.activation_error"));
    });
  }
  /**
   * Método para restablecer conectividad de uns sim
   */

  restartConnectivitySimCard() {
    this.simCardService.suspendSimCard(this.sim_current[0]).subscribe(res => {
      if (res.status == 200) {
        this.presentToastOk(this.translate.instant("simcard.data.suspended_ok"));
        this.preload_simcard = true;
        this.simCardService.activateSimCard(this.sim_current[0]).subscribe(res => {
          if (res.status == 200) {
            this.presentToastOk(this.translate.instant("simcard.data.reconnection_ok"));
            this.ngOnInit();
          }
        }, err => {
          this.presentToastError(this.translate.instant("simcard.error.reconnection_error"));
        });
      }
    }, err => {
      this.presentToastError(this.translate.instant("simcard.error.reconnection_error"));
    });
  }
  /**
   * Activar desactivar imei
   */
  lockImei() {
    if (this.current_endpoint.imei_lock == true) {
      this.current_endpoint.imei_lock = false
    } else {
      this.current_endpoint.imei_lock = true
    }
    this.simCardService.updateEndpoint(this.sim_current[1], this.current_endpoint).subscribe(res => {
      if (res.status == 200) {
        this.presentToastOk(this.translate.instant('simcard.data.settings.settings.imei_update_ok'));
        this.viewEndpointDetailsWithoutOtherServices();
      }
    }, err => {
      if (this.current_endpoint.imei_lock == true) {
        this.current_endpoint.imei_lock = false
      } else {
        this.current_endpoint.imei_lock = true
      }
      this.presentToastOk(this.translate.instant("simcard.data.imei_update_error"));
    });
  }
  /**
   * Actualiza nombre de enpoint
   */
  updateEndpointName() {
    this.current_endpoint.name = this.value.value;
    this.simCardService.updateEndpoint(this.sim_current[1], this.current_endpoint).subscribe(res => {
      if (res.status == 200) {
        this.presentToastOk(this.translate.instant("simcard.data.endpoint_ok"));
        this.viewEndpointDetailsWithoutOtherServices();
      }
    }, err => {
      this.presentToastError(this.translate.instant("simcard.error.endpoint_error"));
    });
  }
  getErrorMessage() {
    return this.value.hasError('maxlength') ? this.translate.instant('platform-one.sim-card.details.setting.update-p-error-len') :
      this.value.hasError('minlength') ? this.translate.instant('platform-one.sim-card.details.setting.update-p-error-len') :
        '';
  }


  /**
   * Método para la ubicación de la sim card
   */
  viewLocationDetails() {
    this.simCardService.getLocationIotM2M(this.sim_current[0]).subscribe(res => {
      let location: any = res.body;
      if (location.length == 0) {
        this.noCoords = true;
        this.presentToastWarning(this.translate.instant("simcard.data.no_current_coordinates"));
        this.showHeat = false;
      } else {
        this.lat = +location.location.lat;
        this.lng = +location.location.lng;
        this.showHeat = true;
      }
      this.preload_maps = false;
    });
  }

  /**
   * Metodo para cargar mapa de calor
   */
  zoomChange(e) {
    var taxiData = [
      new google.maps.LatLng(this.lat, this.lng)
    ];
    let radio = 10;
    let pointArray = new google.maps.MVCArray(taxiData);
    if (e >= 13) {
      radio = 80;
    } else if (e <= 7) {
      radio = 10;
    } else if (e > 7 && e < 13) {
      radio = 40;
    }
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: pointArray,
      radius: radio
    })
  }
  /**
   * Maetodo para cargar mapa de calor
   * @param mapInstance 
   */
  onMapLoad(mapInstance: google.maps.Map) {
    this.map = mapInstance;
    var mapOptions = {
      zoom: 10,
      center: new google.maps.LatLng(this.lat, this.lng),

    };
    this.map.setOptions(mapOptions);
    var taxiData = [
      new google.maps.LatLng(this.lat, this.lng)
    ];
    let pointArray = new google.maps.MVCArray(taxiData);

    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: pointArray,
      radius: 60
    })
    this.heatmap.setMap(this.map);
  }
  /**
   * Método para eliminar una sim
   */
  async deleteSim() {
    const alert = await this.alertController.create({
      header: this.translate.instant("simcard.data.delete_sim_modal") + this.current_sim_card.iccid,
      message: this.translate.instant("simcard.data.are_u_sure"),
      buttons: [
        {
          text: this.translate.instant("simcard.data.yes_delete"),
          cssClass: "color: red",
          handler: () => {
            this.simCardService.deleteSimCardIot(this.sim_current[0]).subscribe(res => {
              if (res.status == 200) {
                this.presentToastOk(this.translate.instant("simcard.data.delete_sim_ok"));
                this.dismiss();
              }
            }, err => {
              this.presentToastError(this.translate.instant("simcard.error.delete_error"));
            });
          }
        }, {
          text: this.translate.instant("simcard.data.cancel_modal"),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }

  async presentToastError(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 3000,
      color: 'danger'
    });
    toast.present();
  }
  async presentToastOk(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 3000,
      color: 'success'
    });
    toast.present();
  }

  async presentToastWarning(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 1500,
      color: 'warning'
    });
    toast.present();
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }

  
  setStep(e){
    this.validity.setValue('1');
    this.step = 1;
  }
  openPlans(){
    this.step = 0;
  }
}
