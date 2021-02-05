import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user/user';
import { FormControl, Validators } from '@angular/forms';
import { ServiceAccountOrganization } from 'src/app/models/service-account/service-account-organization';
import { ItineraryService } from 'src/app/services/itinerary/itinerary.service';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { ServiceAccountService } from 'src/app/services/service-account/service-account.service';
import { SimCardService } from 'src/app/services/sim-card/sim-card.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { Plan } from 'src/app/models/plan/plan';

@Component({
  selector: 'app-itinerary-modal-edit-cancel',
  templateUrl: './itinerary-modal-edit-cancel.component.html',
  styleUrls: ['./itinerary-modal-edit-cancel.component.scss'],
})
export class ItineraryModalEditCancel implements OnInit {
  /**
   * Plan a editar/cancelar
   */
  @Input() data: any;
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
   * Validez en meses
   */
  public validity: FormControl;
  /**
   * Lista de cuentas de la org
   */
  public accounts_list: ServiceAccountOrganization[];
  /**
   * Cuenta de servicio de la sim seleccionada
   */
  public account_selected: FormControl;
  /**
   * Precio final 
   */
  public final_price: number;
  /**
   * Moneda a pagar
   */
  public currency: FormControl;
  /**
   * Nueva fecha
   */
  public new_date: FormControl;
  /**
   * Fecha minima
   */
  public minDayToPlanning: any;
  /**
   * Fecha maxima
   */
  public maxDayToPlanning: any;


  constructor(
    private alertController: AlertController,
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
    this.new_date = new FormControl(null, Validators.required);
    this.minDayToPlanning = this.datePipe.transform(new Date(Date.now() + (86400000 * 3)), 'yyyy-MM-dd');
    this.maxDayToPlanning = this.datePipe.transform(new Date(Date.now() + (86400000 * 365)), 'yyyy-MM-dd');
  }

  /**
   * Carga las sims y las cuentas de servicio
   */
  ngOnInit() {
    this.user = this.localStorageService.getStorageUser();
    this.sim_selected = new FormControl(this.data.sim_card.iccid, Validators.required);
    this.date_selected = new FormControl(this.data.activation_date, Validators.required);
    let lang = this.translate.currentLang;
    if (this.data.action_request == '1') {
      this.action_selected = new FormControl(this.translate.instant('itinerary.edit.activate'), Validators.required);
    } else {
      this.action_selected = new FormControl(this.translate.instant('itinerary.edit.suspend'), Validators.required);
    }
    this.validity = new FormControl(this.data.validity, Validators.required);
    this.account_selected = new FormControl(null);
    this.currency = new FormControl(this.data.currency, Validators.required);
    this.final_price = this.data.value_transaction;
  }

  /**
   * Actualizar fecha de plan
   */
  updatePlan() {
    this.loadingService.presentLoading().then(() => {
      const new_date = {
        activation_date: this.datePipe.transform(this.new_date.value, 'yyyy-MM-dd')
      }
      this.itineraryService.updatePlan(this.data.id, new_date).subscribe(res => {
        if (res.status == 202) {
          this.presentToastOk(this.translate.instant('itinerary.edit.edit_ok'));
          this.loadingService.dismissLoading().then(() => {
            this.modalController.dismiss('updated');
          });
        }

      }, err => {
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('itinerary.errorr.edit_error'))
      });
    });
  }
  /**
   * Eliminar plan
   */
  async deletePlan() {
    const alert = await this.alertController.create({
      header: this.translate.instant('itinerary.edit.header'),
      message: this.translate.instant('itinerary.edit.text'),
      buttons: [
        {
          text: this.translate.instant('itinerary.edit.btn_yes'),
          handler: () => {
            
              this.loadingService.presentLoading().then(() => {
                this.itineraryService.deletePlan(this.data.id).subscribe(res => {
                  this.presentToastOk(this.translate.instant('itinerary.edit.edit_ok'));
                  this.loadingService.dismissLoading().then(() => {
                    this.modalController.dismiss('updated');
                  });
                }, err => {
                  
                  if(err.status == 404){
                    if(err.error.detail == "Maximum refund date has expired"){
                      this.presentToastError(this.translate.instant('itinerary.error.maximum_date'))
                    }
                  } else {
                    this.presentToastError(this.translate.instant('itinerary.error.delete_error'))
                  }
                  console.log(err);
                  this.loadingService.dismissLoading();
                });
              });
          }
        }, {
          text: this.translate.instant('itinerary.edit.btn_cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
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
