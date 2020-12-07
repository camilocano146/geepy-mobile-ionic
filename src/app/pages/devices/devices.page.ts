import {Component, OnInit, ViewChild} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import {ToastController, ModalController, NavController, PopoverController, IonInfiniteScroll, IonContent, IonInput} from '@ionic/angular';
import { DeviceImportComponent } from './device-import/device-import.component';
import { DeviceBuyComponent } from './device-buy/device-buy.component';
import { DeviceSettingsComponent } from './device-settings/device-settings.component';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';
import {Subscription} from 'rxjs';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
})
export class DevicesPage implements OnInit {

  /**
   * Lista de dispotivios del usuario
   */
  public devices_list: any;
  public auxText: string;
  public pageSim = 0;
  public limit = 30;
  private nextPage: boolean;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  private statusSubscriptions: boolean[];
  @ViewChild(IonContent) private content: IonContent;
  private listSubscriptions: Subscription[];
  private isFilteringForText: boolean;
  private timer: number;

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
  }

  ngOnInit(): void {
    if (this.listSubscriptions) {
      for (const subscription of this.listSubscriptions) {
        subscription.unsubscribe();
      }
    }
    if (this.devices_list) {
      this.devices_list.splice(0, this.devices_list.length);
    } else {
      this.devices_list = [];
    }
    if (this.ionInfiniteScroll) {
      this.ionInfiniteScroll.complete().then(value => {
        console.log('complete')
      });
      this.ionInfiniteScroll.disabled = false;
    }
    this.pageSim = 0;
    this.nextPage = true;
    this.statusSubscriptions = [];
    this.listSubscriptions = [];
    this.ionViewDidEnter1();
    if (this.devices_list.length === 0) {
      this.content?.scrollToBottom(300);
    }
  }

  ionViewDidEnter1(event?: CustomEvent) {
    // this.loadingService.presentLoading().then(() => {
    if (this.nextPage) {
      const indexStatusSubscriptions = this.statusSubscriptions.length;
      this.statusSubscriptions.push(true);
      let user = JSON.parse(localStorage.getItem('g_c_user')).id;
      this.deviceService.getDevices(user, this.pageSim++ * this.limit, this.limit, this.auxText).subscribe(res => {
        this.statusSubscriptions[indexStatusSubscriptions] = false;
        this.nextPage = !!res.body.next;
        if (this.isFilteringForText) {
          this.devices_list = res.body.results;
        } else {
          this.devices_list.push(...res.body.results);
        }

        if (!this.statusSubscriptions.find(s => s === true)) {
          // @ts-ignore
          event?.target?.complete();
          if (!this.nextPage) {
            this.ionInfiniteScroll.disabled = true;
          }
        }
      }, err => {
        console.log(err);
        this.loadingService.dismissLoading();
        this.presentToastError("We couldn't load devices");
      });
    }
    // });
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
        this.ngOnInit();
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
        this.ngOnInit();
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
        this.ngOnInit();
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
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
    this.timer = window.setTimeout(() => {
      this.auxText = filterValue;
      this.isFilteringForText = !!this.auxText;
      this.ngOnInit();
    }, AppComponent.timeMillisDelayFilter);
    // if (filterValue != this.auxText) {
    //   this.auxText = filterValue;
    //   this.devices_list.splice(0, this.devices_list.length);
    //   this.copyFull.forEach(element => {
    //     this.devices_list.push(element);
    //   });
    //   let aux = [];
    //   for (let index = 0; index < this.devices_list.length; index++) {
    //     const element: string = this.devices_list[index].iccid;
    //     if (element.includes(filterValue)) {
    //       aux.push(this.devices_list[index]);
    //     }
    //   }
    //   this.devices_list = aux;
    // }
  }

  loadMoreData(event: CustomEvent) {
    this.isFilteringForText = false;
    this.ionViewDidEnter1(event);
  }

  rechargeContent(inputFilter: IonInput) {
    inputFilter.value = '';
    this.auxText = '';
    this.ngOnInit();
  }
}
