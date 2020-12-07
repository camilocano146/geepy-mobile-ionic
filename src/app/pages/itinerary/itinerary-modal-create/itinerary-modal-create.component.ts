import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user/user';
import { FormControl, Validators } from '@angular/forms';
import { ItineraryService } from 'src/app/services/itinerary/itinerary.service';
import { SimCardService } from 'src/app/services/sim-card/sim-card.service';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { Itinerary } from 'src/app/models/itinerary/itinerary';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'src/app/services/loading/loading.service';
import {SimCard} from '../../../models/sim-card/simcard';

@Component({
  selector: 'app-itinerary-modal-create',
  templateUrl: './itinerary-modal-create.component.html',
  styleUrls: ['./itinerary-modal-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItineraryModalCreateComponent implements OnInit {
  public currentLang: any;
  //----------Usuario
  public user: User;
  //----------Pais
  public countriesList: any[];
  public country: FormControl;
  //----------Simcard
  public simsList: any[];
  public simcard: FormControl;
  //----------Fecha
  public minDayToPlanning: any;
  public maxDayToPlanning: any;
  public startDate: FormControl;
  //----------Paquetes
  public avaiablePackages: any[];
  public existsPackages: number;
  public packageselected: any;
  public expanded: boolean;
  //----- Simcard seleccionada
  public lastSimSelected: SimCard;


  constructor(
    private loadingService: LoadingService,
    private cd: ChangeDetectorRef,
    public modalController: ModalController,
    private toastController: ToastController,
    private localStorageService: LocalStorageService,
    private itineraryService: ItineraryService,
    private simCardService: SimCardService,
    private translate: TranslateService) {
    this.currentLang = this.translate.currentLang;
    this.user = this.localStorageService.getStorageUser();
    this.country = new FormControl('', Validators.required);
    this.simcard = new FormControl('', Validators.required);
    this.startDate = new FormControl('', Validators.required);
    const datePipe = new DatePipe('en-US');
    this.minDayToPlanning = datePipe.transform(new Date(Date.now() + (86400000 * 3)), 'yyyy-MM-dd');
    this.maxDayToPlanning = datePipe.transform(new Date(Date.now() + (86400000 * 365)), 'yyyy-MM-dd');
    this.existsPackages = 0;
    this.packageselected = null;
  }

  ngOnInit() {
    this.loadingService.presentLoading().then(() => {
      this.itineraryService.getCountries().subscribe(res => {
        if (res.status == 200) {
          this.countriesList = res.body;
          this.simCardService.getSimCardVoyagerWithoutReferrals(this.user.id, 0, 10).subscribe(res => {
            if (res.status == 200) {
              this.simsList = res.body.results;
            }
            this.loadingService.dismissLoading();
          }, err => {
            this.presentToastError(this.translate.instant('simcard.error.no_load_sim'));
          });
        }
      }, err => {
        console.log(err);
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('simcard.error.no_countries'));
      });
    });

  }

  searchPackages() {
    const data = {
      countrie: this.country.value.id
    }
    this.itineraryService.getPackageRecommended(data).subscribe(res => {
      console.log(res);
      if (res.status == 200) {
        this.avaiablePackages = res.body;
        if (this.avaiablePackages.length == 0) {
          this.existsPackages = 1;
        } else if (this.avaiablePackages.length > 0) {
          for (let index = 0; index < this.avaiablePackages.length; index++) {
            this.avaiablePackages[index].activation_fee_eur = +this.avaiablePackages[index].activation_fee_eur + 1;
            this.avaiablePackages[index].activation_fee_usd = +this.avaiablePackages[index].activation_fee_usd + 1;
            this.avaiablePackages[index].selected = false;
          }
          this.existsPackages = 2;
          this.expanded = true;
        }
      }
    }, err => {
      console.log(err);
      if (err.status == 400 && err.error.countrie) {
        this.presentToastError(this.translate.instant('itinerary.error.country_mandatory'));
      } else {
        this.presentToastError(this.translate.instant('itinerary.error.no_search_packages'));
      }
    });
  }

  openPanelPackages() {
    if (this.expanded == false) {
      this.expanded = true;
    }
  }

  selectPackage(id: any) {
    for (let index = 0; index < this.avaiablePackages.length; index++) {
      if (this.avaiablePackages[index].package_code == id) {
        this.avaiablePackages[index].selected = true;
        this.packageselected = this.avaiablePackages[index];
      } else {
        this.avaiablePackages[index].selected = false;
      }
    }
    this.expanded = false;
    this.cd.detectChanges();
  }

  create() {
    console.log(this.lastSimSelected.id);
    if (this.lastSimSelected && this.startDate.valid && this.packageselected != null && this.country.valid) {
      this.loadingService.presentLoading().then(() => {
        let itinerary: Itinerary = new Itinerary;
        const datePipe = new DatePipe('en-US');
        itinerary.activation_date = datePipe.transform(this.startDate.value, 'yyyy-MM-dd');
        itinerary.destination_id = this.country.value.id;
        itinerary.sim_card_id = this.lastSimSelected.id;
        itinerary.user = this.user.id;
        itinerary.package_id = this.packageselected.id;
        this.itineraryService.createItinerary(itinerary).subscribe(res => {
          if (res.status == 201) {
            this.presentToastOk(this.translate.instant('itinerary.create.created_ok'));
            this.loadingService.dismissLoading().then(() => {
              this.modalController.dismiss(res.body, 'created');
            });
          }
        }, err => {
          console.log(err);
          this.loadingService.dismissLoading();
          if (err.status == 416 && err.error.detail == "Minimum time to program a itinerary need be 2 days before.") {
            this.presentToastError(this.translate.instant('itinerary.error.min_time_48'));
          } else if (err.status == 402 && err.error.detail == "Hasn't enough money") {
            this.presentToastError(this.translate.instant('itinerary.error.not_enough_money'));
          } else if (err.status == 500) {
            this.presentToastError(this.translate.instant('itinerary.error.server_error'));
          } else {
            this.presentToastError(this.translate.instant('itinerary.error.created_error'));
          }
        });
      });
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
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

  changeSimsAutocomplete() {
    if (this.lastSimSelected?.iccid !== this.simcard.value) {
      this.lastSimSelected = undefined;
    }
    this.simCardService.getSimCardVoyagerWithoutReferrals(this.user.id, 0, 10, this.simcard.value).subscribe(res => {
      this.simsList = res.body.results;
    });
  }

  onSelectOption(option: SimCard) {
    this.lastSimSelected = option;
  }
}
