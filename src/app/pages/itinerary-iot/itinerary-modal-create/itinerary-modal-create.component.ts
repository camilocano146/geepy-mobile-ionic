import { Component, OnInit } from '@angular/core';
import { FormControl, Form, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { SimCardService } from 'src/app/services/sim-card/sim-card.service';
import { User } from 'src/app/models/user/user';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { ToastController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ServiceAccountService } from 'src/app/services/service-account/service-account.service';
import { ServiceAccountOrganization } from 'src/app/models/service-account/service-account-organization';
import { Plan } from 'src/app/models/plan/plan';
import { ItineraryService } from 'src/app/services/itinerary/itinerary.service';

@Component({
  selector: 'app-itinerary-modal-create',
  templateUrl: './itinerary-modal-create.component.html',
  styleUrls: ['./itinerary-modal-create.component.scss'],
})
export class ItineraryModalCreate implements OnInit {
  /**
   * Usuario
   */
  public user: User;
  /**
   * Lista de sims
   */
  public sims_list: any[];
  /**
   * Sim seleccionada
   */
  public sim_selected: FormControl;
  /**
   * Acción seleccionada
   */
  public action_selected: FormControl;
  /**
   * Fecha seleccionada
   */
  public date_selected: FormControl;
  /**
   * Fecha minima
   */
  public minDayToPlanning: any;
  /**
   * Fecha maxima
   */
  public maxDayToPlanning: any;
  /**
   * Validez en meses
   */
  public validity: FormControl;
  /**
   * Lista de cuentas de la org
   */
  public accounts_list:ServiceAccountOrganization[];
  /**
   * Cuenta de servicio de la sim seleccionada
   */
  public account_selected: FormControl;
  /**
   * Precio final en usd 
   */
  public final_price_usd: number;
    /**
   * Precio final en eur 
   */
  public final_price_eur: number;
  /**
   * Moneda a pagar
   */
  public currency: FormControl;

  constructor(
    private itineraryService: ItineraryService,
    private modalController: ModalController,
    private serviceAccountService: ServiceAccountService,
    private simCardService: SimCardService,
    private loadingService: LoadingService,
    private localStorageService: LocalStorageService,
    private toastController: ToastController,
    private translate: TranslateService,
    private datePipe: DatePipe
  ) {
    this.user = this.localStorageService.getStorageUser();
    this.sim_selected = new FormControl(null, Validators.required);
    this.date_selected = new FormControl(null, Validators.required);
    this.action_selected = new FormControl(null, Validators.required);
    this.minDayToPlanning = this.datePipe.transform(new Date(Date.now() + (86400000 * 3)), 'yyyy-MM-dd');
    this.maxDayToPlanning = this.datePipe.transform(new Date(Date.now() + (86400000 * 365)), 'yyyy-MM-dd');
    this.validity = new FormControl('1', Validators.required);
    this.account_selected = new FormControl(null);
    this.currency = new FormControl('USD', Validators.required);
    this.final_price_eur = 0;
    this.final_price_usd = 0;
  }

  /**
   * Carga las sims y las cuentas de servicio
   */
  ngOnInit() {
    this.loadingService.presentLoading().then( () => {
      this.simCardService.getSimCardIotWithoutReferrals(this.user.id, 0, 100).subscribe(res => {
        if (res.status == 200) {
          this.sims_list = res.body.results;
          for (let index = 0; index < this.sims_list.length; index++) {
            if (this.sims_list[index].status == 3) {
              this.sims_list.splice(index, 1);
            }
          }
          this.sims_list.sort((a, b) => b.id - a.id);
          this.serviceAccountService.getServiceAccountByOrg().subscribe(res => {
            if (res.status == 200) {
              this.accounts_list = res.body;
              this.loadingService.dismissLoading();
            }
          }, err => {
            this.loadingService.dismissLoading();
            this.presentToastError('No pudimos cargar paquetes');
          });
        }
      }, err => {
        console.log(err);
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('simcard.error.no_load_sim'));
      });
    });
  }
  /**
   * Obtiene el valor a pagar del paquete
   */
  calculateNewValueToPurchase() {
    this.final_price_usd = +this.account_selected.value.customer_price_usd * +this.validity.value;
    this.final_price_eur = +this.account_selected.value.customer_price_eur * +this.validity.value;
  }
  /**
   * Seleccion de una sim
   */
  selectSimCard(){
    for (let index = 0; index < this.accounts_list.length; index++) {
      if(this.sim_selected.value.emnify_account.id == this.accounts_list[index].account.id){
        this.account_selected.setValue(this.accounts_list[index]);
        this.final_price_usd = +this.account_selected.value.customer_price_usd * +this.validity.value;
        this.final_price_eur = +this.account_selected.value.customer_price_eur * +this.validity.value;
        break;
      }
    }
  }

   /**
   * Crear plan
   */
  createPlan(){
    if(this.sim_selected.valid && this.account_selected.valid && this.action_selected.valid && this.date_selected.valid){
      this.loadingService.presentLoading().then( () => {
        let plan: Plan = new Plan();
        plan.activation_date = this.datePipe.transform(this.date_selected.value, 'yyyy-MM-dd');
        plan.user = this.user.id;
        plan.sim_card_id = this.sim_selected.value.id;
        plan.validity = +this.validity.value;
        plan.currency = this.currency.value;
        plan.action_request = ""+this.action_selected.value;
        this.itineraryService.createPlan(plan).subscribe( res => {
          if(res.status == 201){
            this.presentToastOk(this.translate.instant('itinerary.create.created_ok'));
            this.loadingService.dismissLoading().then( () => {
              this.modalController.dismiss('created');
            });
          }
         
        }, err => {
          this.loadingService.dismissLoading();
          if (err.status == 402 && err.error.detail == "Hasn't enough money") {
            this.presentToastError(this.translate.instant('itinerary.create.not_enough_money'));
          } else if (err.status == 500) {
            this.presentToastError(this.translate.instant('itinerary.create.server error'));
          } else {
            this.presentToastError(this.translate.instant('itinerary.create.error_create'));
          }
          console.log(err);
        });
  
      });
    }
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

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }
}
