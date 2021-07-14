import { Component, OnInit } from '@angular/core';
import {LoadingService} from '../../../services/loading/loading.service';
import {ModalController, NavController, PopoverController, ToastController} from '@ionic/angular';
import {ItineraryService} from '../../../services/itinerary/itinerary.service';
import {TranslateService} from '@ngx-translate/core';
import {ItineraryModalEditComponent} from '../itinerary-modal-edit/itinerary-modal-edit.component';
import {ItineraryModalCreateComponent} from '../itinerary-modal-create/itinerary-modal-create.component';
import {PopoverComponent} from '../../../common-components/popover/popover.component';
import {HelpComponent} from '../../../common-components/help/help.component';
import {GroupItineraryVoyager} from '../../../models/group-itinerary-voyager/GroupItineraryVoyager';
import {ManageLocalStorage} from '../../../utilities/ManageLocalStorage';

@Component({
  selector: 'app-itinerary-home',
  templateUrl: './itinerary-home.component.html',
  styleUrls: ['./itinerary-home.component.scss'],
})
export class ItineraryHomeComponent implements OnInit {

  public existsItineraries: number;
  public itinerariesList: any[];
  public groupsList: any[];
  public currentLang: any;
  public copyFull: any[];
  public auxText: string;
  isGroup: boolean;

  constructor(
    private loadingService: LoadingService,
    private popoverController: PopoverController,
    private itineraryService: ItineraryService,
    private toastController: ToastController,
    private translateService: TranslateService,
    private modalController: ModalController,
    private navController: NavController,
    private translate: TranslateService
  ) {
    this.existsItineraries = 0;
    this.currentLang = this.translateService.currentLang;
    this.copyFull = [];
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    if (!this.isGroup) {
      this.itinerariesList = [];
      this.loadingService.presentLoading().then( () => {
        this.itineraryService.getItineraries().subscribe(res => {
          if (res.status == 200) {
            this.copyFull = res.body;
            this.itinerariesList.push(...res.body);
            this.structureItineriryList();
          }
        }, err => {
          console.log(err);
          this.loadingService.dismissLoading();
          this.presentToastError(this.translate.instant('itinerary.error.no_itineraries'));
        });
      });
    } else {
      this.groupsList = [];
      this.loadingService.presentLoading().then( () => {
        this.itineraryService.getGroups().subscribe(res => {
          if (res.status == 200) {
            this.copyFull = res.body;
            this.groupsList.push(...res.body);
            this.structureGroupList();
          }
        }, err => {
          console.log(err);
          this.loadingService.dismissLoading();
          this.presentToastError(this.translate.instant('itinerary.error.no_itineraries'));
        });
      });
    }
  }

  structureGroupList(){
    if (this.groupsList.length > 1) {
      this.groupsList.sort( (a, b) => b.id - a.id);
    }
    if (this.groupsList.length == 0) {
      this.existsItineraries = 1;
    } else if (this.groupsList.length > 0) {
      this.existsItineraries = 2;
    }
    this.loadingService.dismissLoading();
  }

  structureItineriryList(){
    // if (this.itinerariesList.length > 1) {
    //   this.itinerariesList.sort( (a,b) => b.id - a.id);
    // }
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
  applyFilter(filterValue: string) {
    if (filterValue != this.auxText){
      this.auxText = filterValue;
      this.itinerariesList.splice(0, this.itinerariesList.length);
      this.copyFull.forEach(element => {
        this.itinerariesList.push(element);
      });
      const aux = [];
      for (let index = 0; index < this.itinerariesList.length; index++) {
        const element: string = this.itinerariesList[index].sim_card.iccid;
        const endpoint: string = this.itinerariesList[index].sim_card.endpoint;
        if (element.includes(filterValue) || element.includes(endpoint)) {
          aux.push(this.itinerariesList[index]);
        }
      }
      this.itinerariesList = aux;
    }
  }
  /**
   * Abrir modal de ver y editar
   */
  async goToSeeEditItinerary(data){
    const modal = await this.modalController.create({
      component: ItineraryModalEditComponent,
      componentProps: {
        data
      }
    });
    modal.onDidDismiss().then(res => {
      if (res.data.action == 'cancel') {
        this.removeTrip(res.data.id);
      }else if (res.data.action == 'saved'){
        this.ionViewDidEnter();
      }
    }).catch();
    return await modal.present();
  }

  removeTrip(id_trip){
    for (let i = 0; i < this.itinerariesList.length; i++){
      if (id_trip == this.itinerariesList[i].id){
        this.itinerariesList.splice(i, 1);
        if (this.itinerariesList.length == 0){
          this.existsItineraries = 1;
        }
      }
    }
  }

  /**
   * Crear itinerario
   */
  async openModalCreate() {
    const modal = await this.modalController.create({
      component: ItineraryModalCreateComponent
    });
    modal.onDidDismiss().then(res => {
      if (res.role == 'created') {
        this.addItemToItinerariesList(res.data);
      }
    }).catch();

    return await modal.present();
  }

  addItemToItinerariesList(packageItinerary) {
    this.copyFull.push(packageItinerary);
    this.itinerariesList.push(packageItinerary);
    this.structureItineriryList();
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

  goToHome() {
    this.navController.navigateBack('select-platform');
  }

  async helpDialog($event: MouseEvent) {
    const modal = await this.modalController.create({
      component: HelpComponent
    });
    return await modal.present();
  }

  showIndividual() {
    this.isGroup = false;
    this.ionViewDidEnter();
  }

  showGroup() {
    this.isGroup = true;
    this.ionViewDidEnter();
  }

  openModalCreateGroup() {
    this.navController.navigateForward('home/itinerary-voyager/group');
  }

  goToSeeEditGroup(item: GroupItineraryVoyager) {
    ManageLocalStorage.saveGroupItineraryVoyager(item);
    this.navController.navigateForward('home/itinerary-voyager/group', { queryParams: { idGroup: item.id } });
  }
}
