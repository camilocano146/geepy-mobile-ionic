import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user/user';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { SimCardService } from 'src/app/services/sim-card/sim-card.service';
import { NavController, ModalController } from '@ionic/angular';
import { SimModalImportICCID } from './sim-modal-import-iccid/sim-modal-import-iccid';
import { SimModalImportONUM } from './sim-modal-import-onum/sim-modal-import-onum';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';
import { SimModalBuy } from './sim-modal-buy/sim-modal-buy.component';
import { TranslateService } from '@ngx-translate/core';
import { SimModalSeeRealComponent } from './sim-modal-see-real/sim-modal-see-real.component';

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

  test() {
    this.navController.navigateRoot('repurchase-package');
  }
  /**
   * Carga el contenido cuando entra
   */
  ionViewDidEnter() {
    this.simCardService.getSimCardByUser(this.user.id).subscribe(res => {
      if (res.status == 200) {
        this.simsList = res.body[1];
        for (let index = 0; index < this.simsList.length; index++) {
          if (this.simsList[index].status == 3) {
            this.simsList.splice(index, 1);
          }
        }
        this.simsList.sort((a, b) => b.id - a.id);
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
        this.ionViewDidEnter();
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
        this.ionViewDidEnter();
      }
    }).catch();

    return await modal.present();
  }
  /**
   * Settings SIMS
   */
  async openModalSettings(item) {
    localStorage.setItem('sim_current', JSON.stringify(item));
    this.navController.navigateRoot("home/simcards/settings");
  }
  /**
   * Comprar sims
   */
  async openModalBuySims() {
    const modal = await this.modalController.create({
      component: SimModalBuy
    });
    modal.onDidDismiss().then(res => {
    }).catch();
    return await modal.present();
  }
  /**
   * Abre moda para ver sim real
  */
  async openModalSeeRealSim() {
    const modal = await this.modalController.create({
      component: SimModalSeeRealComponent
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