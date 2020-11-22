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
import { LoadingService } from 'src/app/services/loading/loading.service';

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
    private loadingService: LoadingService,
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


  ionViewDidEnter(){
    this.loadingService.presentLoading().then( () => {
      this.simCardService.getSimCardByUser(this.user.id).subscribe(res => {
        if (res.status == 200) {
          this.simsList = res.body[1];
          const indexOfRemoveElements: number[] = [];
          for (let index = 0; index < this.simsList.length; index++) {
            if (this.simsList[index].status == 3) {
              indexOfRemoveElements.push(index);
            }
          }
          const elementsList = [];
          for (let index = 0; index < this.simsList.length; index++) {
            const valueExist = indexOfRemoveElements.find(v => v == index);
            if (valueExist === undefined) {
              elementsList.push(this.simsList[index]);
            }
          }
          this.copyFull = [];
          this.simsList = elementsList;
          this.simsList.sort((a, b) => b.id - a.id);
          this.copyFull.push(...this.simsList);
          this.simCardService.getSimCardByUserVoyager(this.user.id).subscribe(res => {
            if (res.status == 200) {
              const indexOfRemoveElements1: number[] = [];
              const simsReferrals = res.body;
              for (let index = 0; index < simsReferrals.length; index++) {
                const simCardRepeated = this.simsList.find(s => s.id === simsReferrals[index].id);
                if (simsReferrals.status == 3 || simCardRepeated) {
                  indexOfRemoveElements1.push(index);
                }
              }
              const elementsList1 = [];
              for (let index = 0; index < simsReferrals.length; index++) {
                const valueExist1 = indexOfRemoveElements1.find(v => v == index);
                if (valueExist1 === undefined) {
                  elementsList1.push(simsReferrals[index]);
                }
              }
              this.simsList.push(...elementsList1);
              this.simsList.sort((a, b) => b.id - a.id);
              this.copyFull.push(...elementsList1);
            }
            this.preloadSims = true;
            this.loadingService.dismissLoading();
          }, err => {
            this.loadingService.dismissLoading();
            this.presentToastError(this.translate.instant('simcard.error.no_load_sim'));
          });
        }
      }, err => {
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('simcard.error.no_load_sim'));
      });
    });
  }

  test() {
    this.navController.navigateRoot('repurchase-package');
  }

  /**
   * Filtro
   */
  applyFilter(filterValue: string) {
    if (filterValue != this.auxText) {
      filterValue = filterValue.toLowerCase();
      this.auxText = filterValue;
      this.simsList.splice(0, this.simsList.length);
      this.copyFull.forEach(element => {
        this.simsList.push(element);
      });
      let aux = [];
      for (let index = 0; index < this.simsList.length; index++) {
        const element: string = this.simsList[index].iccid;
        const name: string = this.simsList[index].endpoint;
        if ((element && element.includes(filterValue)) || (name && name.toLowerCase().includes(filterValue))) {
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

  goToHome(){
    this.navController.navigateBack('select-platform');
  }
}
