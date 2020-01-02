import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user/user';
import { FormControl, Validators } from '@angular/forms';
import { ItineraryService } from 'src/app/services/itinerary/itinerary.service';
import { SimCardService } from 'src/app/services/sim-card/sim-card.service';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { Itinerary } from 'src/app/models/itinerary/itinerary';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-itinerary-modal-create',
  templateUrl: './itinerary-modal-create.component.html',
  styleUrls: ['./itinerary-modal-create.component.scss'],
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
  public simcard: any;
  //----------Fecha
  public minDayToPlanning: any;
  public maxDayToPlanning: any;
  public startDate: FormControl;
  //----------Paquetes
  public avaiablePackages: any[];
  public existsPackages: number;
  public packageselected: any;
  public expanded: boolean;


  constructor(
    public modalController: ModalController,
    private toastController: ToastController,
    private localStorageService: LocalStorageService,
    private itineraryService: ItineraryService,
    private alertController: AlertController,
    private simCardService: SimCardService,
    private translateService: TranslateService) {
    this.currentLang = this.translateService.currentLang;
    this.user = this.localStorageService.getStorageUser();
    this.country = new FormControl('', Validators.required);
    this.simcard = new FormControl('', Validators.required);
    this.startDate = new FormControl('', Validators.required);
    const datePipe = new DatePipe('en-US');
    this.minDayToPlanning = datePipe.transform(new Date(Date.now() + (86400000 * 2)), 'yyyy-MM-dd');
    this.maxDayToPlanning = datePipe.transform(new Date(Date.now() + (86400000 * 365)), 'yyyy-MM-dd');
    this.existsPackages = 0;
    this.packageselected = null;
  }

  ngOnInit() {
    this.itineraryService.getCountries().subscribe(res => {
      if (res.status == 200) {
        this.countriesList = res.body;
        this.simCardService.getSimCardByUser(this.user.id).subscribe(res => {
          if (res.status == 200) {
            this.simsList = res.body[1];
          }
        }, err => {
          this.presentToastError("We couldn't load sim cards.");
        });
      }

    }, err => {
      console.log(err);
      this.presentToastError("We couldn't obtain countries.");
    });
  }

  searchPackages() {
    const data = {
      countrie: this.country.value.id
    }
    this.itineraryService.getPackageRecommended(data).subscribe(res => {
      if (res.status == 200) {
        this.avaiablePackages = res.body;
        console.log(this.avaiablePackages);

        if (this.avaiablePackages.length == 0) {
          this.existsPackages = 1;
        } else if (this.avaiablePackages.length > 0) {
          for (let index = 0; index < this.avaiablePackages.length; index++) {
            this.avaiablePackages[index].activation_fee_eur = +this.avaiablePackages[index].activation_fee_eur + 1;
            this.avaiablePackages[index].activation_fee_usd = +this.avaiablePackages[index].activation_fee_usd + 1;
            this.avaiablePackages[index].selected = false;
          }
          console.log(this.avaiablePackages);
          this.existsPackages = 2;
          this.expanded = true;
        }
      }
    }, err => {
      console.log(err);
      if (err.status == 400 && err.error.countrie) {
        this.presentToastError('Campo country is mandatory.');
      }

    });
  }

  openPanelPackages() {
    if (this.expanded == false) {
      this.expanded = true;
    }
  }


  selectPackage(id) {
    for (let index = 0; index < this.avaiablePackages.length; index++) {
      if (this.avaiablePackages[index].package_code == id) {
        this.avaiablePackages[index].selected = true;
        this.packageselected = this.avaiablePackages[index];
      } else {
        this.avaiablePackages[index].selected = false;
      }
    }
    this.expanded = false;
  }

  create() {
    if (this.simcard.valid && this.startDate.valid && this.packageselected != null && this.country.valid) {
      let itinerary: Itinerary = new Itinerary;
      const datePipe = new DatePipe('en-US');
      itinerary.activation_date = datePipe.transform(this.startDate.value, 'yyyy-MM-dd');
      itinerary.destination_id = this.country.value.id;
      itinerary.sim_card_id = this.simcard.value.id;
      itinerary.user = this.user.id;
      itinerary.package_id = this.packageselected.id;
      console.log(itinerary);
      this.itineraryService.createItinerary(itinerary).subscribe(res => {
        if (res.status == 201) {
          console.log(res);
          this.presentToastOk('Itinerary has been updated successfully.');
          this.modalController.dismiss('created');
        }
      }, err => {
        console.log(err);
        if (err.status == 416 && err.error.detail == "Minimum time to program a itinerary need be 2 days before.") {
          this.presentToastError('Minimum time to program a itinerary need be 2 days before.');
        } else if (err.status == 402 && err.error.detail == "Hasn't enough money") {
          this.presentToastError("Hasn't enough money.");
        } else if (err.status == 500) {
          this.presentToastError('Server error.');
        } else {
          this.presentToastError('We cannot create this itam.');
        }
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
}
