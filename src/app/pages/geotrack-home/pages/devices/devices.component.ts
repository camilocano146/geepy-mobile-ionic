import {Component, OnInit} from '@angular/core';
import {ModalController, NavController, PopoverController, ToastController} from '@ionic/angular';
import {LoadingService} from '../../../../services/loading/loading.service';
import {TranslateService} from '@ngx-translate/core';
import {DeviceRegisterComponent} from './device-register/device-register.component';
import {IotDeviceGeotrackService} from '../../../../services/io-device-geotrack/iot-device-geotrack.service';
import {LocalStorageService} from '../../../../services/local-storage/local-storage.service';
import {ToastService} from '../../../../services/toast/toast.service';
import {IotDeviceGeoTrack} from '../../../../models/iot_device_geotrack/iot_device_geotrack';
import {Router} from '@angular/router';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
})
export class DevicesComponent implements OnInit {
  public allDevicesList: IotDeviceGeoTrack[];
  private interval: any;
  private preload: boolean;
  private filterDevicesList: IotDeviceGeoTrack[];

  constructor(
    private popoverController: PopoverController,
    private navController: NavController,
    private loadingService: LoadingService,
    private toastController: ToastController,
    private translate: TranslateService,
    private modalController: ModalController,
    private iotDeviceGeotrackService: IotDeviceGeotrackService,
    public localStorageService: LocalStorageService,
    public toastService: ToastService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.startLoading();
    this.iotDeviceGeotrackService.getDevicesOfUser(this.localStorageService.getStorageUser().id, 99999999, 0).subscribe(
      value => {
        this.allDevicesList = value.results;
        this.filterDevicesList = JSON.parse(JSON.stringify(this.allDevicesList));
        this.preload = false;
      },
      error => {
        this.preload = false;
        this.toastService.presentToastError(this.translate.instant('geo.devices.error_get_device'));
      }
    );
  }

  openModalSettings(item: any) {

  }

  private startLoading() {
    this.loadingService.presentLoading().then(() => {
      this.stopLoading();
    });
  }

  stopLoading() {
    this.interval = setInterval(() => {
      if (this.preload === false) {
        clearInterval(this.interval);
        this.interval = null;
        this.loadingService.dismissLoading();
      }
    }, 500);
  }

  async openModalRegisterDevice() {
    const modal = await this.modalController.create({
      component: DeviceRegisterComponent,
      componentProps: {
        'data': 1
      }

    });
    modal.onDidDismiss().then(res => {
      if (res.data === 'created') {
        // this.ionViewDidEnter();
      }
    }).catch();
    return await modal.present();
  }

  applyFilter(value: string, removeLastCharacter?: boolean) {
    if (removeLastCharacter) {
      value = value.substr(0, value.length-1);
    }
    this.filterDevicesList.splice(0, this.filterDevicesList.length);
    for (const device of this.allDevicesList) {
      if (device.imei.toString().includes(value)) {
        this.filterDevicesList.push(device);
      }
    }
  }

  openTrakingMap(item: IotDeviceGeoTrack) {
    console.log('----------------------');
    this.router.navigate([`geotrack-home/tracking/${item.id}`]);
  }
}
