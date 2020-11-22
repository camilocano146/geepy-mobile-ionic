import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ToastController, ModalController, NavController, PopoverController } from '@ionic/angular';
import { DeviceImportComponent } from './device-import/device-import.component';
import { DeviceBuyComponent } from './device-buy/device-buy.component';
import { DeviceSettingsComponent } from './device-settings/device-settings.component';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
})
export class DevicesPage {

  /**
   * Lista de dispotivios del usuario
   */
  public devices_list: any;
  public copyFull: any[];
  public auxText: string;

  constructor(
    private popoverController: PopoverController,
    private navController: NavController,
    private modalController: ModalController,
    private toastController: ToastController,
    private loadingService: LoadingService,
    private translate: TranslateService,
    private deviceService: DeviceService,
  ) {
    this.devices_list = [];
    this.copyFull = [];
  }

  ionViewDidEnter() {
    this.loadingService.presentLoading().then(() => {
      let user = JSON.parse(localStorage.getItem('g_c_user')).id;
      this.deviceService.getDevices(user).subscribe(res => {
        this.devices_list = res.body;
        this.loadingService.dismissLoading();
        this.devices_list.forEach(element => {
          this.copyFull.push(element);
        });
      }, err => {
        console.log(err);
        this.loadingService.dismissLoading();
        this.presentToastError("We couldn't load devices");
      });
    });
  }

    /**
   * Importar SIMS por ICCID
   */
  async openModalImportICCID() {
    const modal = await this.modalController.create({
      component: DeviceImportComponent
    });
    modal.onDidDismiss().then(res => {
      if (res.data == "imported") {
        this.ionViewDidEnter();
      }
    }).catch();
    return await modal.present();
  }

      /**
   * Comprar 
   */
  async openModalDevice() {
    const modal = await this.modalController.create({
      component: DeviceBuyComponent
    });
    modal.onDidDismiss().then(res => {
      if (res.data == "imported") {
        this.ionViewDidEnter();
      }
    }).catch();
    return await modal.present();
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
  /**
   * Comprar sims
   */
  async openModalBuySims() {
    const modal = await this.modalController.create({
      component: DeviceBuyComponent
    });
    modal.onDidDismiss().then(res => {
    }).catch();
    return await modal.present();
  }

  async openModalSettings(data) {
    const modal = await this.modalController.create({
      component: DeviceSettingsComponent,
      componentProps: {
        'data': data
      }

    });
    modal.onDidDismiss().then(res => {
      if (res.data == "updated") {
        this.ionViewDidEnter();
      }
    }).catch();
    return await modal.present();
  }
  
  goToHome(){
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

  applyFilter(filterValue: any) {
    if (filterValue != this.auxText) {
      this.auxText = filterValue;
      this.devices_list.splice(0, this.devices_list.length);
      this.copyFull.forEach(element => {
        this.devices_list.push(element);
      });
      let aux = [];
      for (let index = 0; index < this.devices_list.length; index++) {
        const element: string = this.devices_list[index].iccid;
        if (element.includes(filterValue)) {
          aux.push(this.devices_list[index]);
        }
      }
      this.devices_list = aux;
    }
  }
}
