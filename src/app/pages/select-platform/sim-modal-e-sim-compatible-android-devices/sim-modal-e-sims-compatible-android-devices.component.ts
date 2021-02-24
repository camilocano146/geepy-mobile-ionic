import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams, ToastController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {DeviceService} from '../../../services/device/device.service';
import {LoadingService} from '../../../services/loading/loading.service';

@Component({
  selector: 'app-sim-modal-buy',
  templateUrl: './sim-modal-e-sims-compatible-android-devices.component.html',
  styleUrls: ['./sim-modal-e-sims-compatible-android-devices.component.scss'],
})
export class SimModalESimsCompatibleAndroidDevicesComponent implements OnInit {
  public static readonly COMPATIBLE_DEVICES_ANDROID = 'Android';
  // Lenguaje
  public language: string;
  public listDevices = [];
  public typeDevice = this.navParams.get('data');

  constructor(
    private translate: TranslateService,
    private deviceService: DeviceService,
    private modalController: ModalController,
    private navParams: NavParams,
    private loadingService: LoadingService,
    private toastController: ToastController,
  ) {
    this.language = this.translate.currentLang;
    this.loadDevices();
  }

  ngOnInit() {
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }

  loadDevices() {
    this.loadingService.presentLoading().then( () => {
      console.log(this.typeDevice);
      const name = this.typeDevice ? 'Android' : 'iOS';
      this.deviceService.getCompatibleDevicesOsType().subscribe(value => {
        const devices = (value.body as any[])?.find(v => v.name.toString().toUpperCase() === name.toUpperCase());
        this.listDevices = devices?.devices;
        this.loadingService.dismissLoading();
      }, error => {
        this.presentToastError(this.translate.instant('simcard.e_sims.compatible_devices.error'));
        this.loadingService.dismissLoading();
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
}
