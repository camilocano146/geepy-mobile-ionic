import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user/user';
import { UserService } from 'src/app/services/user/user.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { SimCardService } from 'src/app/services/sim-card/sim-card.service';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { SimModalImportICCID } from './sim-modal-import-iccid/sim-modal-import-iccid';
import { SimModalSettings } from './sim-modal-settings/sim-modal-settings';
import { SimModalImportONUM } from './sim-modal-import-onum/sim-modal-import-onum';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';
import { SimModalBuy } from './sim-modal-buy/sim-modal-buy.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sim-cards',
  templateUrl: './sim-cards.page.html',
  styleUrls: ['./sim-cards.page.scss'],
})
export class SimCardsPage implements OnInit {
  /**
   * Ususario de la app
   */
  public user: User;
  /**
   * Lista de sims
   */
  public simsList: any[];
  public copyFull: any[];
  public auxText: string;
  /**
   * Preload de sims
   */
  public preloadSims: boolean;

  constructor(
    private localStorageService: LocalStorageService,
    private simCardService: SimCardService,
    public popoverController: PopoverController,
    public modalController: ModalController,
    private toastController: ToastController,
    private navController: NavController,
    private translate: TranslateService) {
    this.preloadSims = false;
    this.simsList = [];
    this.copyFull = [];
    this.user = this.localStorageService.getStorageUser();
  }

  ngOnInit() {
    
  }

  test(){
    this.navController.navigateRoot('repurchase-package');
  }
  /**
   * Carga el contenido cuando entra
   */
  ionViewDidEnter(){
    this.simCardService.getSimCardByUser(this.user.id).subscribe(res => {
      if (res.status == 200) {
        this.simsList = res.body[1];
        for (let index = 0; index < this.simsList.length; index++) {
          if(this.simsList[index].status == 3){
            this.simsList.splice(index,1);
          }
        }
        this.simsList.sort( (a,b) => b.id - a.id);
        this.simsList.forEach(element => {
          this.copyFull.push(element);
        });
        
        this.preloadSims = true;
      }
    }, err => {
      this.presentToastError(this.translate.instant('simcard.error.no_load_sim'));
    });
  }
  /**
   * Filtro
   */
  applyFilter(filterValue: string) {
    if (filterValue != this.auxText) {
      this.auxText = filterValue;
      this.simsList.splice(0, this.simsList.length);
      this.copyFull.forEach(element => {
        this.simsList.push(element);
      });
      let aux = [];
      for (let index = 0; index < this.simsList.length; index++) {
        const element: string = this.simsList[index].iccid;
        if (element.includes(filterValue)) {
          aux.push(this.simsList[index]);
        }
      }
      this.simsList = aux;
    }
  }

  /**
   * Importar SIMS por ICCID
   */
  async openModalImportICCID() {
    const modal = await this.modalController.create({
      component: SimModalImportICCID
    });
    modal.onDidDismiss().then(res => {
      if (res.data == "imported") {
        this.ngOnInit();
      }
    }).catch();

    return await modal.present();
  }
  /**
   * Importar SIMS por ONUM
   */
  async openModalImportONUM() {
    const modal = await this.modalController.create({
      component: SimModalImportONUM
    });
    modal.onDidDismiss().then(res => {
      if (res.data == "imported") {
        this.ngOnInit();
      }
    }).catch();

    return await modal.present();
  }
  /**
   * Settings SIMS
   */
  async openModalSettings(item) {
    const modal = await this.modalController.create({
      component: SimModalSettings,
      componentProps: {
        'sim_current': item
      }
    });
    modal.onDidDismiss().then(res => {
      this.ngOnInit();

    }).catch();

    return await modal.present();
  }
  /**
   * Comprar sims
   */
  async openModalBuySims(){
    const modal = await this.modalController.create({
      component: SimModalBuy
    });
    modal.onDidDismiss().then(res => {
    }).catch();
    return await modal.present();
  }
  /**
   * Menu
   */
  async settingsPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      mode: 'ios',
    });
    return await popover.present();
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