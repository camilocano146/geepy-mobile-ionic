import { Component, OnInit } from '@angular/core';
import { UssdCodesService } from 'src/app/services/ussd-codes/ussd-codes.service';
import { ToastController, PopoverController, NavController, ModalController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';
import { UssdCode } from 'src/app/models/ussd/ussd';
import { TranslateService } from '@ngx-translate/core';
import { UssdCodeModalCallComponent } from './ussd-code-modal-call/ussd-code-modal-call.component';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-ussd-codes',
  templateUrl: './ussd-codes.page.html',
  styleUrls: ['./ussd-codes.page.scss'],
})
export class UssdCodesPage implements OnInit {
  /**
   * Lista de codigos
   */
  public ussdList: UssdCode[];
  /**
   * Lenguaje
   */
  public language: string;

  constructor(
    private loadingService: LoadingService,
    private ussdCodesService: UssdCodesService,
    private toastController: ToastController,
    private popoverController: PopoverController,
    private navController: NavController,
    private modalController: ModalController,
    private translate: TranslateService) {
    this.ussdList = null;
    this.language = this.translate.currentLang;
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadingService.presentLoading().then( ()=> {
      this.ussdCodesService.getUSSDCOdes().subscribe(res => {
        if (res.status == 200) {
          this.ussdList = res.body;
          this.loadingService.dismissLoading();
        }
      }, err => {
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('ussd_codes.error.no_load_ussd_codes'));
      });
    });
    
  }

  goToDetails(item){

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
  async settingsPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      mode: 'ios',
    });
    return await popover.present();
  }
  goToHome(){
    this.navController.navigateRoot("home");
  }
   /**
   * Importar SIMS por ICCID
   */
  async openModalDetailsCode(item) {
    const modal = await this.modalController.create({
      component: UssdCodeModalCallComponent,
      componentProps: {
        'data': item
      }
    });
    modal.onDidDismiss().then(res => {
      
    }).catch();

    return await modal.present();
  }
}