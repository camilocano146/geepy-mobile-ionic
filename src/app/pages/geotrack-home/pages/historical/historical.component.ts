import {Component, OnInit} from '@angular/core';
import {ModalController, NavController, PopoverController, ToastController} from '@ionic/angular';
import {LoadingService} from '../../../../services/loading/loading.service';
import {TranslateService} from '@ngx-translate/core';
import {PopoverComponent} from '../../../../common-components/popover/popover.component';
import {DialogFilterRoutesComponent} from './filter-routes/dialog-filter-routes.component';
import {Device} from '../../../../models/device/device';
import {IotDeviceGeotrackService} from '../../../../services/io-device-geotrack/iot-device-geotrack.service';

@Component({
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.scss'],
})
export class HistoricalComponent implements OnInit {
  height: any = 10;
  lng: any = -73;
  lat: any = 5;
  zoom: any = 4;
  public listDevicesDisplayed: Device[] = [];

  constructor(
    private popoverController: PopoverController,
    private navController: NavController,
    private dialog: ModalController,
    private loadingService: LoadingService,
    private toastController: ToastController,
    private translate: TranslateService,
    private iotDeviceGeotrackService: IotDeviceGeotrackService,) {
    this.listDevicesDisplayed = iotDeviceGeotrackService.listDevicesDisplayed;
  }

  ngOnInit() {}

  goToHome() {
    this.navController.navigateBack('select-platform');
  }

  async settingsPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      mode: 'ios',
    });
    return await popover.present();
  }

  async openDialogFilterRoute() {
    const modal = await this.dialog.create({
      component: DialogFilterRoutesComponent,
      cssClass: 'fullscreen',
      componentProps: {
        data: 1
      }
    });
    modal.onDidDismiss().then(res => {
      if (res) {
        console.log(res);
      }
    }).catch();
    return await modal.present();
  }
}
