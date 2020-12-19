import {Component, OnInit, ViewChild} from '@angular/core';
import {LoadingService} from '../../../services/loading/loading.service';
import {LocalStorageService} from '../../../services/local-storage/local-storage.service';
import {SimCardService} from '../../../services/sim-card/sim-card.service';
import {IonContent, IonInfiniteScroll, IonInput, ModalController, NavController, PopoverController, ToastController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {User} from '../../../models/user/user';
import {AppComponent} from '../../../app.component';
import {SimModalImportICCID} from '../sim-modal-import-iccid/sim-modal-import-iccid';
import {SimModalImportONUM} from '../sim-modal-import-onum/sim-modal-import-onum';
import {SimBuyPage} from '../sim-buy-page/sim-buy-page.component';
import {SimModalSeeRealComponent} from '../sim-modal-see-real/sim-modal-see-real.component';
import {PopoverComponent} from '../../../common-components/popover/popover.component';
import {SimModalESimBuy} from '../sim-modal-buy-e-sim/sim-modal-buy.component';

@Component({
  selector: 'app-e-sims',
  templateUrl: './physical-sims-page.component.html',
  styleUrls: ['./physical-sims-page.component.scss'],
})
export class PhysicalSimsPage implements OnInit {
  /**
   * Ususario de la app
   */
  public user: User;
  /**
   * Lista de sims
   */
  public simsList: any[];
  public auxText: string;
  /**
   * Preload de sims
   */
  public preloadSims: boolean;
  public pageSim = 0;
  public limit = 30;
  private nextPage: boolean;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) private content: IonContent;
  private isFilteringForText: boolean;
  private timer: number;

  constructor(private loadingService: LoadingService,
              private localStorageService: LocalStorageService,
              private simCardService: SimCardService,
              public popoverController: PopoverController,
              public modalController: ModalController,
              private toastController: ToastController,
              private navController: NavController,
              private translate: TranslateService
  ) {
    this.preloadSims = false;
    this.simsList = [];
    this.user = this.localStorageService.getStorageUser();
  }

  ngOnInit() {
  }

  /**
   * Importar SIMS por ICCID
   */
  async openModalImportICCID() {
    const modal = await this.modalController.create({
      component: SimModalImportICCID
    });
    modal.onDidDismiss().then(res => {
      if (res.data === 'imported') {
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
      if (res.data === 'imported') {
        this.ngOnInit();
      }
    }).catch();

    return await modal.present();
  }
  /**
   * Settings SIMS
   */
  async openModalSettings(item) {
    localStorage.setItem('sim_current', JSON.stringify(item));
    this.navController.navigateRoot('home/simcards/settings');
  }
  /**
   * Comprar sims
   */
  async openModalBuySims() {
    this.navController.navigateRoot('home/simcards/purchase-activate-physical-sims/order');
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

  goToSims(){
    this.navController.navigateBack('home/simcards');
  }

  goToAllESims() {
    this.navController.navigateRoot('home/simcards/my-physical-sims');
  }
}
