import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController, NavController, ToastController} from '@ionic/angular';
import {Itinerary} from '../../../models/itinerary/itinerary';
import {TranslateService} from '@ngx-translate/core';
import {LoadingService} from '../../../services/loading/loading.service';
import {ItineraryService} from '../../../services/itinerary/itinerary.service';
import {HelpComponent} from '../../../common-components/help/help.component';
import {FormControl} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {GroupItineraryVoyager} from '../../../models/group-itinerary-voyager/GroupItineraryVoyager';
import {ItineraryModalEditComponent} from '../itinerary-modal-edit/itinerary-modal-edit.component';
import {ItineraryModalCreateComponent} from '../itinerary-modal-create/itinerary-modal-create.component';
import {ManageLocalStorage} from '../../../utilities/ManageLocalStorage';

@Component({
  selector: 'app-itinerary-groups',
  templateUrl: './itinerary-group.component.html',
  styleUrls: ['./itinerary-group.component.scss'],
})
export class ItineraryGroupComponent implements OnInit {
  existsItineraries: number;
  itinerariesList: Itinerary[] = [];
  currentLang: string;
  formControlGroupName: FormControl = new FormControl('');
  idGroup: number;
  showGroupEdit: boolean;
  group: GroupItineraryVoyager;

  constructor(
    private navController: NavController,
    private translateService: TranslateService,
    private loadingService: LoadingService,
    private itineraryService: ItineraryService,
    private toastController: ToastController,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) {
    this.existsItineraries = 0;
    this.currentLang = this.translateService.currentLang;

    this.activatedRoute.queryParams.subscribe(params => {
      this.idGroup = params?.idGroup;
      if (!this.idGroup) {
        this.showGroupEdit = true;
      }
    });

    this.group = ManageLocalStorage.getGroupItineraryVoyager();
    this.formControlGroupName.setValue(this.group.name);
  }

  ionViewDidEnter(){
    this.itinerariesList = [];
    this.loadingService.presentLoading().then( () => {
      this.itineraryService.getItinerariesOfGroup(this.idGroup).subscribe(res => {
        if (res.status == 200) {
          this.itinerariesList.push(...res.body);
          this.structureItineriryList();
        }
      }, err => {
        console.log(err);
        this.loadingService.dismissLoading();
        this.presentToastError(this.translateService.instant('itinerary.error.no_itineraries'));
      });
    });
  }

  async presentToastError(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 3000,
      color: 'danger'
    });
    toast.present();
  }

  structureItineriryList(): void {
    // if (this.itinerariesList.length > 1) {
    //   this.itinerariesList.sort( (a, b) => b.id - a.id);
    // }
    if (this.itinerariesList.length === 0) {
      this.existsItineraries = 1;
    } else if (this.itinerariesList.length > 0) {
      this.existsItineraries = 2;
    }
    this.loadingService.dismissLoading();
  }

  ngOnInit() {}

  goToItineraryHome() {
    this.navController.navigateBack('home/itinerary-voyager');
  }

  saveGroup() {
    this.formControlGroupName.setValue(this.formControlGroupName.value?.trim());
    if (this.formControlGroupName.value) {
      const group: GroupItineraryVoyager = {
        name: this.formControlGroupName.value
      };
      this.loadingService.presentLoading().then( () => {
        if (this.idGroup) {
          this.itineraryService.editGroup(this.idGroup, group).subscribe(res => {
            this.showGroupEdit = false;
            this.presentToastOk(this.translateService.instant('itinerary.group.saved'));
            this.loadingService.dismissLoading();
            this.group.name = this.formControlGroupName.value;
          }, err => {
            this.presentToastError(this.translateService.instant('itinerary.error.no_group_saved'));
            this.loadingService.dismissLoading();
          });
        } else {
          this.itineraryService.createGroup(group).subscribe(res => {
            this.presentToastOk(this.translateService.instant('itinerary.group.saved'));
            this.showGroupEdit = false;
            this.loadingService.dismissLoading();
            this.group.name = this.formControlGroupName.value;
          }, err => {
            this.presentToastError(this.translateService.instant('itinerary.error.no_group_saved'));
            this.loadingService.dismissLoading();
          });
        }
      });
    }
  }

  async presentToastOk(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 3000,
      color: 'success'
    });
    toast.present();
  }

  async openModalCreate() {
    const modal = await this.modalController.create({
      component: ItineraryModalCreateComponent,
      componentProps: {
        group: this.group,
      }
    });
    modal.onDidDismiss().then(res => {
      if (res.role == 'created') {
        this.ionViewDidEnter();
      }
    }).catch();

    return await modal.present();
  }

  async goToSeeEdit(data){
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

  async helpDialog($event: MouseEvent) {
    const modal = await this.modalController.create({
      component: HelpComponent
    });
    return await modal.present();
  }

  async removeGroup(): Promise<any> {
    const alert = await this.alertController.create({
      header: this.translateService.instant('itinerary.group.remove_header'),
      message: this.translateService.instant('itinerary.group.remove_text'),
      buttons: [
        {
          text: this.translateService.instant('itinerary.edit.btn_yes'),
          handler: () => {
            this.loadingService.presentLoading().then(() => {
              this.itineraryService.removeGroup(this.idGroup).subscribe(res => {
                if (res.status == 204) {
                  this.presentToastOk(this.translateService.instant('itinerary.edit.edit_ok'));
                  this.loadingService.dismissLoading().then(() => {
                    this.navController.navigateBack('home/itinerary-voyager');
                  });
                }
              }, err => {
                console.log(err);
                this.loadingService.dismissLoading();
                this.presentToastError(this.translateService.instant('simcard.error.maximum_date'));
              });
            });
          }
        }, {
          text: this.translateService.instant('itinerary.edit.btn_cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }
      ]
    });
    await alert.present();
  }
}
