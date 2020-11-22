import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { TranslateService } from '@ngx-translate/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { ServiceAccountIridiumService } from 'src/app/services/service-account/service-account-iridium.service';
import { FormControl, Validators } from '@angular/forms';
import { Courier } from 'src/app/models/courier/courier';
import { SimCardService } from 'src/app/services/sim-card/sim-card.service';
import { ZonesService } from 'src/app/services/zones/zones.service';
import { ServiceAccountService } from 'src/app/services/service-account/service-account.service';
import { CourierService } from 'src/app/services/courier/courier.service';
import { Global } from 'src/app/models/global/global';
import { OrderSims } from 'src/app/models/order/order';
import { OrderDevice } from 'src/app/models/order/order-iridium';

@Component({
  selector: 'app-device-buy',
  templateUrl: './device-buy.component.html',
  styleUrls: ['./device-buy.component.scss'],
})
export class DeviceBuyComponent implements OnInit {

  //----Paquetes de sims
  public simsPackages: any[];
  public packageSelected: FormControl;
  //----Pais
  public countriesList: any[];
  public countrySelected: FormControl;
  //----Ciudad
  public city: FormControl;
  //----Dirección
  public address: FormControl;
  //----Telefono
  public phone: FormControl;
  //----Courier
  public courier_list: Courier[];
  public courier_selected: FormControl;
  //----Zip
  public zip: FormControl;
  //----Cuenta de servicio
  public serviceAccountsList: any[];
  public accountSelected: FormControl;
  //----Lenguaje
  public language: string;
  //---Currency
  public currency: FormControl;

  constructor(
    private loadingService: LoadingService,
    private toastController: ToastController,
    private modalController: ModalController,
    private deviceService: DeviceService,
    private zonesService: ZonesService,
    private serviceAccountService: ServiceAccountIridiumService,
    private translate: TranslateService,
    private courierService: CourierService
  ) {
    this.packageSelected = new FormControl(null, [Validators.required]);
    this.countrySelected = new FormControl(null, [Validators.required]);
    this.city = new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(40)]);
    this.address = new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]);
    this.zip = new FormControl(null, [Validators.required, Validators.min(1), Validators.max(9999999999)]);
    this.accountSelected = new FormControl(null, Validators.required);
    this.language = this.translate.currentLang;
    this.phone = new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]);
    this.courier_selected = new FormControl(null, Validators.required);
    this.currency = new FormControl(null, Validators.required);
  }

  ngOnInit() {
    this.getSimsPackages();
  }

  /**
   * Trae pauetes de sims
   */
  getSimsPackages() {
    this.loadingService.presentLoading().then(() => {
      this.deviceService.getDevicesPackages().subscribe(res => {
        if (res.status == 200) {
          this.simsPackages = res.body;
          this.getCountries();
        }
      }, err => {
        console.log(err);
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('simcard.error.no_sim_packages'))
      });

    });
  }

  /**
   * Trae los paises
   */
  getCountries() {
    this.zonesService.getAvailableCountiresToPurchase().subscribe(res => {
      if (res.status == 200) {
        this.countriesList = res.body;
        this.getServicesAccount();
      }
    }, err => {
      console.log(err);
      this.loadingService.dismissLoading();
      this.presentToastError(this.translate.instant('simcard.error.no_countries'))
    });
  }
  /**
   * Trae las cuentas de servicio
   */
  getServicesAccount() {
    this.serviceAccountService.getServiceAccountIridium().subscribe(res => {
      if (res.status == 200) {
        this.serviceAccountsList = res.body;
        this.getCouriers();
      }
    }, err => {
      this.loadingService.dismissLoading();
      this.presentToastError(this.translate.instant('simcard.error.services_account'));
    });
  }

  getCouriers() {
    this.courierService.getCouriersByOrg(Global.organization_id).subscribe(res => {
      if (res.status == 200) {

        this.courier_list = res.body;
        this.loadingService.dismissLoading();
      }
    }, err => {
      this.loadingService.dismissLoading();
      this.presentToastError(this.translate.instant('simcard.data.buy_sims.courier_error'));
    });
  }

  order() {
    if (this.packageSelected.valid && this.countrySelected.valid && this.city.valid && this.address.valid && this.zip.valid && this.phone.valid) {
      this.loadingService.presentLoading().then(() => {
        let order: OrderDevice = new OrderDevice(
          this.currency.value,
          this.zip.value,
          this.countrySelected.value.id,
          this.city.value,
          this.address.value,
          this.phone.value,
          this.packageSelected.value.id,
          this.accountSelected.value.id,
          this.courier_selected.value.id
        );

        this.deviceService.orderDevice(order).subscribe(res => {
          if (res.status == 201) {
            this.presentToastOk('Dispositivo comprado exitosamente');
            this.loadingService.dismissLoading().then( () => {
              this.dismiss();
            });
           
          }
        }, err => {
          this.loadingService.dismissLoading();
          console.log(err);
          if (err.status == 402 && err.error.detail == "Hasn't enough money") {
            this.presentToastError(this.translate.instant("simcard.error.not_enough_money"));
          } else {
            this.presentToastError('No pudimos realizar la solicitud.');
          }
        });
      });
      
    }
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
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
      duration: 3000,
      color: 'warning'
    });
    toast.present();
  }

}
