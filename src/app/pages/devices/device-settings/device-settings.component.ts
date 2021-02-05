import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Destinatary } from 'src/app/models/destinatary/destinatary';
import { ToastController, ModalController, AlertController } from '@ionic/angular';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ModulesService } from 'src/app/services/modules/modules.service';

@Component({
  selector: 'app-device-settings',
  templateUrl: './device-settings.component.html',
  styleUrls: ['./device-settings.component.scss'],
})
export class DeviceSettingsComponent implements OnInit {
  /**
   * Info del device actual
   */
  @Input() data: any;
  /**
   * Info del device current
   */
  public current_device: any;
  //-------Contratos
  public preload_contract: boolean;
  /**
   * Lista de contratos
   */
  public contracts_list: any[];
  //-----Usage
  public preload_usage: boolean;
  /**
   *Costo del mes actual
  */
  public cost: number;
  /**
   *Tamaño del mes actual en bytes
  */
  public size_in_bytes: number;
  //-----Ultimo contrayo
  /**
   * último contrato
   */
  public last_susbcriber: any;
  /**
   * Preload último contrato
   */
  public preload_last_susbcriber: boolean;
  //----Paquetes
  /**
   * Listado de paquetes
   */
  public package_list: any[];
  /**
   * Preload de paquetes
   */
  public preload_packages: boolean;
  public final_price_usd: number;
  public final_price_eur: number;
  /**
   * Lista de validity
   */
  public validity: FormControl;
  //------Tabla de destinatarios

  /**
   * Nombre destino
   */
  public destiny: FormControl;

  public type: FormControl;

  public moack: FormControl;

  public geodata: FormControl;

  public preload_destinatary_add: boolean;

  public isSuspending: FormControl;

  public list_destinataries: any;
  public preload_destinatary_delete: boolean;
  public interval: any;
  public codes_permission: string[];
  public show_details: boolean;
  public show_contracts: boolean;
  public show_plans: boolean;
  public show_destinataries: boolean;
  public show_settings: boolean;
  public preload_permissions: boolean;
  public current_plan: any;
  public step: number;
  public validity_suspencion: FormControl;

  constructor(
    private moduleService: ModulesService,
    private loadingService: LoadingService,
    public alertController: AlertController,
    private modalController: ModalController,
    private toastController: ToastController,
    private translate: TranslateService,
    private deviceService: DeviceService) {
    this.current_plan = null;
    this.isSuspending = new FormControl(false);
    this.contracts_list = [];
    this.preload_contract = true;
    this.preload_usage = true;
    this.cost = 0;
    this.size_in_bytes = 0;
    this.preload_last_susbcriber = true;
    this.preload_packages = true;
    this.package_list = [];
    this.destiny = new FormControl('', [Validators.required, Validators.maxLength(30)]);
    this.type = new FormControl('', [Validators.required,]);
    this.moack = new FormControl(false, [Validators.required]);
    this.geodata = new FormControl(false, [Validators.required]);
    this.preload_destinatary_add = false;
    this.preload_destinatary_delete = false;
    this.validity = new FormControl('1');
    this.codes_permission = ['53', '54', '55', '56', '57'];
    this.preload_permissions = false;
    this.show_details = true;
    this.show_contracts = false;
    this.show_plans = false;
    this.show_destinataries = false;
    this.show_settings = false;
    this.step = 1;
    this.validity_suspencion = new FormControl('1');
  }

  ngOnInit(): void {
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

  /**
   * Obtiene permisos de modulos
   */
  getPermissions() {
    const data = {
      codes: this.codes_permission
    };
    this.moduleService.getStatesModuleOrganizationPlatformVector(data).subscribe(res => {
      if (res.body[0].is_active == true) {
        this.show_details = true;
      }
      if (res.body[1].is_active == true) {
        this.show_contracts = true;
      }
      if (res.body[2].is_active == true) {
        this.show_plans = true;
      }
      if (res.body[3].is_active == true) {
        this.show_destinataries = true;
      }
      if (res.body[4].is_active == true) {
        this.show_settings = true;
      }
      this.preload_permissions = false;
      this.getContractsOfDevice();
      this.getUsage();
      this.getLastSusbcriber();
      this.getPackages();
    }, err => {
      console.log(err);
      this.loadingService.dismissLoading();
      this.presentToastError(this.translate.instant("simcard.error.error_permission"));
    });
  }

  stopLoading() {
    //Pregunto
    this.interval = setInterval(() => {
      if (this.preload_contract == false &&
        this.preload_usage == false &&
        this.preload_last_susbcriber == false &&
        this.preload_packages == false &&
        this.preload_permissions == false) {
        if (this.contracts_list.length > 0 && this.package_list.length > 0) {
          for (let index = 0; index < this.package_list.length; index++) {
            if (this.package_list[index].plan.iridium_id == this.contracts_list[0].plan.id) {
              this.current_plan = this.package_list[index];
            }
          }
        }
        clearInterval(this.interval);
        this.interval = null;
        this.loadingService.dismissLoading();
      } else {

      }
    }, 500);
  }

  /**
   * Obtener ultimo suscriber
   */
  getLastSusbcriber() {
    this.deviceService.getLastSuscriber(this.data.id).subscribe(res => {
      this.last_susbcriber = res.body;
      this.deviceService.getDestinationsByModem(this.data.id).subscribe(res => {
        this.preload_last_susbcriber = false;
      }, err => {
        console.log(err);
        this.presentToastError(this.translate.instant('platform_iridium.devices.setttings.error_destinataries'));
      });
    }, err => {
      console.log(err);
      this.presentToastError(this.translate.instant('platform_iridium.devices.setttings.error_last_contract'));
    });
  }
  /**
  * Obtener contratos de un device
  */
  getContractsOfDevice() {
    this.deviceService.getDeviceContracts(this.data.id).subscribe(res => {
      this.contracts_list = [];
      if (res.body.contracts) {
        this.contracts_list = res.body.contracts;
        if (this.contracts_list.length > 50) {
          let aux: any[];
          for (let index = 0; index < 50; index++) {
            aux.push(this.contracts_list[index]);
          }
          this.contracts_list = aux;
        }
      }
      this.preload_contract = false;
    }, err => {
      console.log(err);
      this.presentToastError(this.translate.instant('platform_iridium.devices.setttings.error_contracts'));
    });
  }

  /**
   * Obtener consumo
   */
  getUsage() {
    let today: Date = new Date(Date.now());
    const data = {
      year: today.getFullYear(),
      month: today.getMonth() + 1
    }
    this.deviceService.getUsage(this.data.id, data).subscribe(res => {
      if(res.body.error){
        this.presentToastError(this.translate.instant('platform_iridium.devices.setttings.error_consume'));
        this.preload_usage = false;
      }
      if (res.body.usage) {
        res.body.usage.forEach(element => {
          this.cost += +element.cost;
          this.size_in_bytes += +element.size;
        });
        this.size_in_bytes = this.size_in_bytes * 0.000001;
        this.preload_usage = false;
      }
    }, err => {
      console.log(err);
      this.presentToastError(this.translate.instant('platform_iridium.devices.setttings.error_consume'));
    });
  }
  /**
   * Obtiene lista de paquetes
   */
  getPackages() {
    this.deviceService.getPlans().subscribe(res => {
      this.package_list = res.body;
      this.preload_packages = false;
    }, err => {
      console.log(err);
      this.presentToastError(this.translate.instant('platform_iridium.devices.setttings.error_plans'));
    });
  }
  /**
   * Activar
   */
  async activate(id, currency, item, action) {
    let suspend_desactivate: number;
    if (action) {
      suspend_desactivate = 3;
    } else {
      suspend_desactivate = 2;
    }
    let cost_usd = +item.custom_activation_price_usd + (+item.custom_package_price_usd * +this.validity.value);
    let cost_eur = +item.custom_activation_price_eur + (+item.custom_package_price_eur * +this.validity.value);

    let message: string;
    message = `Vigencia servicio: ${this.validity.value} months. `;
    if (this.isSuspending.value == true) {
      cost_usd += +this.validity_suspencion.value * +item.custom_suspension_price_usd;
      cost_eur += +this.validity_suspencion.value * +item.custom_suspension_price_eur;
      message += `Vigencia suspención: ${this.validity_suspencion.value} months. `;
    }
    if (currency == 'USD') {
      message += ` Final cost: ${cost_usd} USD`
    } else {
      message += ` Final cost: ${cost_eur} EUR`
    }
    const alert = await this.alertController.create({
      header: `Buy plan ${id + 1}`,
      message: message,
      buttons: [
        {
          text: this.translate.instant('sign_out.btn_yes'),
          handler: () => {
            this.loadingService.presentLoading().then(() => {
              const dataActivation = {
                plan: item.plan.id,
                currency: currency,
                postContract: ""+suspend_desactivate,
                validity: +this.validity.value,
                suspensionValidity: +this.validity_suspencion.value
              }
              this.deviceService.activate(this.data.id, dataActivation).subscribe(res => {
                this.presentToastOk(this.translate.instant('platform_iridium.devices.setttings.activate'));
                this.validity.setValue('1');
                this.validity_suspencion.setValue('1');
                this.loadingService.dismissLoading().then( ()=> {
                  this.modalController.dismiss('updated');
                });
              }, err => {
                console.log(err);
                if (err.status == 402 && err.error.detail == "Hasn't enough money") {
                  this.presentToastError(this.translate.instant('simcard.data.settings.package.not_enough_money'));
                } else {
                  this.presentToastError(this.translate.instant('platform_iridium.devices.setttings.error_activate'));
                }
                this.loadingService.dismissLoading();
              });
            });
          }
        }, {
          text: this.translate.instant('sign_out.btn_cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }
  /**
   * DesActivar
   */
  desactivate() {
    this.loadingService.presentLoading().then(() => {
      const dataDesc = {
        plan: this.current_plan.plan.id
      }
      this.deviceService.desactivate(this.data.id, dataDesc).subscribe(res => {
        this.presentToastOk(this.translate.instant('platform_iridium.devices.setttings.desactivate'));
        this.loadingService.dismissLoading().then( ()=> {
          this.modalController.dismiss('updated');
        });
      }, err => {
        console.log(err);
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('platform_iridium.devices.setttings.error_desactivate'));
      });
    });
    
  }

  resumeSuspend() {
    this.loadingService.presentLoading().then( () => {
      this.deviceService.resume(this.data.id).subscribe(res => {
        if(res.body.error){
          this.loadingService.dismissLoading();
          this.presentToastError(this.translate.instant('platform_iridium.devices.setttings.error_resume'));
        } else {
          this.presentToastOk(this.translate.instant('platform_iridium.devices.setttings.resume'));
          this.loadingService.dismissLoading().then( ()=> {
            this.modalController.dismiss('updated');
          });
        }
      }, err => {
        console.log(err);
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('platform_iridium.devices.setttings.error_resume'));
      });
    });
  }

  async resumeExpired(currency, data, action) {
    let suspend_desactivate: number;
    if (action) {
      suspend_desactivate = 3;
    } else {
      suspend_desactivate = 2;
    }
    let cost_usd = (+this.current_plan.custom_package_price_usd * +this.validity.value);
    let cost_eur = (+this.current_plan.custom_package_price_eur * +this.validity.value);

    let message: string;
    message = `Vigencia servicio: ${this.validity.value} months. `;
    if (this.isSuspending.value == true) {
      cost_usd += +this.validity_suspencion.value * +this.current_plan.custom_suspension_price_usd;
      cost_eur += +this.validity_suspencion.value * +this.current_plan.custom_suspension_price_eur;
      message += `Vigencia suspención: ${this.validity_suspencion.value} months. `;
    }
    if (currency == 'USD') {
      message += ` Final cost: ${cost_usd} USD`
    } else {
      message += ` Final cost: ${cost_eur} EUR`
    }
    const alert = await this.alertController.create({
      header: `Resume plan`,
      message: message,
      buttons: [
        {
          text: this.translate.instant('sign_out.btn_yes'),
          handler: () => {
            this.loadingService.presentLoading().then(() => {
              const dataActivation = {
                currency: currency,
                postContract: ""+suspend_desactivate,
                validity: +this.validity.value,
                validitySuspension: +this.validity_suspencion.value
              }
              this.deviceService.resumeSuscription(this.data.id, dataActivation).subscribe(res => {
                this.presentToastOk(this.translate.instant('platform_iridium.devices.setttings.activate'));
                this.validity.setValue('1');
                this.validity_suspencion.setValue('1');
                this.loadingService.dismissLoading().then( ()=> {
                  this.modalController.dismiss('updated');
                });
              }, err => {
                console.log(err);
                if (err.status == 402 && err.error.detail == "Hasn't enough money") {
                  this.presentToastError(this.translate.instant('simcard.data.settings.package.not_enough_money'));
                } else {
                  this.presentToastError(this.translate.instant('platform_iridium.devices.setttings.error_activate'));
                }
                this.loadingService.dismissLoading();
              });
            });
          }
        }, {
          text: this.translate.instant('sign_out.btn_cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }
      ]
    });
    await alert.present();
  }

  suspend(data) {
    const dataSuspended = {
      currency: data
    }
    this.loadingService.presentLoading().then( () => {
      this.deviceService.suspend(this.data.id, dataSuspended).subscribe(res => {
        this.presentToastOk(this.translate.instant('platform_iridium.devices.setttings.suspend'));
        this.getContractsOfDevice();
        this.getUsage();
        this.getLastSusbcriber();
        this.getPackages();
        this.validity.setValue('1');
        this.validity_suspencion.setValue('1');
        this.loadingService.dismissLoading().then( ()=> {
          this.modalController.dismiss('updated');
        });
      }, err => {
        console.log(err);
        if (err.status == 402 && err.error.detail == "Hasn't enough money") {
          this.presentToastError(this.translate.instant('simcard.data.settings.package.not_enough_money'));
        } else {
          this.presentToastError(this.translate.instant('platform_iridium.devices.setttings.error_suspend'));
        }
        this.loadingService.dismissLoading();
      });
    });
   
  }

  /**
   * Agregar un destinatario
   */
  addDestinatary() {
    if (this.destiny.valid && this.type.valid && this.moack.valid && this.geodata.valid) {
      this.loadingService.presentLoading().then( () => {
        this.preload_destinatary_add = true;
        let destinatary: Destinatary = new Destinatary(this.data.id, this.destiny.value, +this.type.value, this.moack.value, this.geodata.value);
        this.deviceService.addDestinatary(destinatary).subscribe(res => {
          this.loadingService.dismissLoading();
          this.presentToastOk(this.translate.instant('platform_iridium.devices.setttings.destinatary_add_ok'));
          this.getLastSusbcriber();
          this.preload_destinatary_add = false;
        }, err => {
          if (err.status == 400 && err.error.exceptions[0].name == "Duplicate Destination") {
            this.presentToastError(this.translate.instant('platform_iridium.devices.setttings.error_duplicate'));
          } else if (err.status == 400 && err.error.exceptions[0].name == "Too Many Destinations (Max 5)") {
            this.presentToastError(this.translate.instant('platform_iridium.devices.setttings.max_5_destinatary'));
          } else if (err.status == 400 && err.error.exceptions[0].name == "Invalid MOACK") {
            this.presentToastError(this.translate.instant('platform_iridium.devices.setttings.error_moack'));
          } else {
            this.presentToastError(this.translate.instant('platform_iridium.devices.setttings.destinatary_add_error'));
          }
          this.loadingService.dismissLoading();
          this.preload_destinatary_add = false;
        });
      });
      
    }
  }

  deleteDestinatary(id) {
    this.loadingService.presentLoading().then( () => {
      this.preload_destinatary_delete = true;
      this.deviceService.deleteDestinatary(id).subscribe(res => {
        this.loadingService.dismissLoading();
        this.preload_destinatary_delete = false;
        this.getLastSusbcriber();
        this.presentToastOk(this.translate.instant('platform_iridium.devices.setttings.destinatary_delete_ok'));
      }, err => {
        this.preload_destinatary_delete = false;
        console.log(err);
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('platform_iridium.devices.setttings.destinatary_delete_error'));
      });
    });
    
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
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }

  setStep(e){
    this.validity.setValue('1');
    this.validity_suspencion.setValue('1');
    this.step = 1;
  }
  openPlans(){
    this.step = 0;
  }
}
