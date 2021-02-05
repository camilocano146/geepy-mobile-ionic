import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ServiceAccountOrganization } from 'src/app/models/service-account/service-account-organization';
import { ToastController, ModalController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { TranslateService } from '@ngx-translate/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { ServiceAccountIridiumService } from 'src/app/services/service-account/service-account-iridium.service';
import { DeviceImportImei } from 'src/app/models/device/device-import-imei';
import { Global } from 'src/app/models/global/global';

@Component({
  selector: 'app-device-import',
  templateUrl: './device-import.component.html',
  styleUrls: ['./device-import.component.scss'],
})
export class DeviceImportComponent implements OnInit {


  public iccid: FormControl;
  public serviceAccountsList: ServiceAccountOrganization[];
  public accountSelected: FormControl;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private loadingService: LoadingService,
    private translate: TranslateService,
    private deviceService: DeviceService,
    private serviceAccountService: ServiceAccountIridiumService
  ) {
    this.serviceAccountsList = [];
    this.iccid = new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(21)]);
    this.accountSelected = new FormControl(null, Validators.required);
  }

  ngOnInit() {
    this.loadingService.presentLoading().then(() => {
      this.serviceAccountService.getServiceAccountIridium().subscribe(res => {
        if (res.status == 200) {
          this.serviceAccountsList = res.body;
          this.loadingService.dismissLoading();
        }
      }, err => {
        this.loadingService.dismissLoading();

        this.presentToastError(this.translate.instant('platform_iridium.devices.import.error_accounts'));
      });
    });
  }

  /**
   * Importar por IMEI
   */
  import(){
    if(this.iccid.valid && this.accountSelected.valid){
      this.loadingService.presentLoading();
      let device: DeviceImportImei = new DeviceImportImei(this.iccid.value, JSON.parse(localStorage.getItem('g_c_user')).id,Global.organization_id,this.accountSelected.value.id);
      this.deviceService.importImei(device).subscribe( res => {
        this.presentToastOk(this.translate.instant('platform_iridium.devices.import.import_ok'));
        this.loadingService.dismissLoading().then(() => {
          this.modalController.dismiss("imported");
        });
      }, err => {
        this.loadingService.dismissLoading();
        console.log(err);
        if (err.error.name) {
          if (err.error.name[0] == "Ya existe un/a modem con este/a name.") {
            this.presentToastError(this.translate.instant('platform_iridium.devices.import.error_name'));
          }
        } else {
          this.presentToastError(this.translate.instant('platform_iridium.devices.import.import_error'));
        }
      });
    }
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
}
