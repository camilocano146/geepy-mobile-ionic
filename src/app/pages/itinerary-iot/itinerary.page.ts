import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { PopoverController, ToastController, ModalController, NavController } from '@ionic/angular';
import { ItineraryService } from 'src/app/services/itinerary/itinerary.service';
import { TranslateService } from '@ngx-translate/core';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';
import { ItineraryModalCreate } from './itinerary-modal-create/itinerary-modal-create.component';
import { ItineraryModalEditCancel } from './itinerary-modal-edit-cancel/itinerary-modal-edit-cancel.component';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.page.html',
  styleUrls: ['./itinerary.page.scss'],
})
export class ItineraryPage implements OnInit {

  public existsItineraries: number;
  public itinerariesList: any[];
  public currentLang: any;
  public copyFull: any[];
  public auxText: string;

  constructor(
    private navController: NavController,
    private loadingService: LoadingService,
    private popoverController: PopoverController,
    private itineraryService: ItineraryService,
    private toastController: ToastController,
    private translateService: TranslateService,
    private modalController: ModalController,
    private translate: TranslateService
  ) {
    this.existsItineraries = 0;
    this.currentLang = this.translateService.currentLang;
    this.copyFull = [];
    this.auxText = "";
  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.loadingService.presentLoading().then(() => {
      this.itineraryService.getItinerariesIot().subscribe(res => {
        if (res.status == 200) {
          this.itinerariesList = res.body;
          this.itinerariesList.forEach(element => {
            this.copyFull.push(element);
          });
          this.structureItineriryList();
        }
      }, err => {
        console.log(err);
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('itinerary.error.no_itineraries'));
      });
    });
  }

  structureItineriryList() {
    if (this, this.itinerariesList.length > 1) {
      this.itinerariesList.sort((a, b) => b.id - a.id);
    }
    if (this.itinerariesList.length == 0) {
      this.existsItineraries = 1;
    } else if (this.itinerariesList.length > 0) {
      this.existsItineraries = 2;
    }
    this.loadingService.dismissLoading();
  }
  /**
 * Filtro
 */
  applyFilter(filterValue) {
    if (filterValue != this.auxText) {
      this.auxText = filterValue;
      this.itinerariesList.splice(0, this.itinerariesList.length);
      this.copyFull.forEach(element => {
        this.itinerariesList.push(element);
      });
      let aux = [];
      for (let index = 0; index < this.itinerariesList.length; index++) {
        const element: string = this.itinerariesList[index].sim_card.iccid;
        if (element.includes(filterValue)) {
          aux.push(this.itinerariesList[index]);
        }
      }
      this.itinerariesList = aux;
    }
  }
  /**
   * Abrir modal de ver y editar
   * */
   async goToSeeEdit(data){
    const modal = await this.modalController.create({
      component: ItineraryModalEditCancel,
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


  /**
 * Crear itinerario
 *  */
 async openModalCreate() {
    const modal = await this.modalController.create({
      component: ItineraryModalCreate
    });
    modal.onDidDismiss().then(res => {
      if (res.data == "created") {
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
  async settingsPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      mode: 'ios',
    });
    return await popover.present();
  }
  goToHome(){
    this.navController.navigateBack('select-platform');
  }
}
