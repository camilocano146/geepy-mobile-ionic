import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SimCardService } from 'src/app/services/sim-card/sim-card.service';
import { ServiceAccountService } from 'src/app/services/service-account/service-account.service';
import { ImportSimcard } from 'src/app/models/sim-card/imported-simcard';
import { ServiceAccountOrganization } from 'src/app/models/service-account/service-account-organization';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'sim-modal-import-iccid-page',
  templateUrl: './sim-modal-import-iccid.html',
  styleUrls: ['./sim-modal-import-iccid.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SimModalImportICCID implements OnInit {


  public iccid: FormControl;
  public serviceAccountsList: ServiceAccountOrganization[];
  public accountSelected: FormControl;
  public isActive: FormControl;
  public validity: FormControl;
  public final_price_usd: number;
  public final_price_eur: number;
  public currency: FormControl;

  constructor(
    private loadingService: LoadingService,
    public modalController: ModalController,
    private translate: TranslateService,
    public toastController: ToastController,
    private simCardService: SimCardService,
    private serviceAccountService: ServiceAccountService) {
    this.currency = new FormControl('USD', Validators.required);
    this.iccid = new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(21)]);
    this.isActive = new FormControl(false, Validators.required);
    this.accountSelected = new FormControl(null, Validators.required);
    this.validity = new FormControl('1', Validators.required);
    this.final_price_eur = 0;
    this.final_price_usd = 0;

  }

  ngOnInit(): void {
    this.loadingService.presentLoading().then(() => {
      this.serviceAccountService.getServiceAccountByOrg().subscribe(res => {
        if (res.status == 200) {
          this.serviceAccountsList = res.body;
          this.loadingService.dismissLoading();
        }
      }, err => {
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('simcard.error.services_account'));
      });
    });
  }

  import() {
    if (this.iccid.valid && this.accountSelected.valid) {
      this.loadingService.presentLoading().then( () => {
        let simcard: ImportSimcard = new ImportSimcard();
        simcard.account = this.accountSelected.value.account.id;
        simcard.iccid = this.iccid.value;
        simcard.activate = this.isActive.value;
        simcard.validity = this.validity.value;
        simcard.currency = this.currency.value;
        this.simCardService.importSimCard(simcard).subscribe(res => {
          if (res.status == 201) {
            this.presentToastOk(this.translate.instant('simcard.data.import_iccid.import_ok'));
            this.loadingService.dismissLoading().then( () => {
              this.modalController.dismiss("imported");
            });
          }
        }, err => {
          this.loadingService.dismissLoading();
          if (err.error.Details) {
            if (err.error.Details[1].substring(0, 9) == "duplicate") {
              this.presentToastError(this.translate.instant('simcard.data.import_iccid.duplicate'));
            }
          } else if (err.status == 402 && err.error.detail == "Hasn't enough money") {
            this.presentToastError(this.translate.instant('simcard.data.settings.package.not_enough_money'));
          } else {
            this.presentToastError(this.translate.instant('simcard.error.error_register'));
          }
        });
      });
      
    }
  }
  calculateFinalPrice() {
    this.final_price_usd = +this.accountSelected.value.customer_price_usd * +this.validity.value;
    this.final_price_eur = +this.accountSelected.value.customer_price_eur * +this.validity.value;
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
  /**
    * Devuelve el mensaje de email incorrecto
    */
  getErrorMessageCode() {
    return this.iccid.hasError("required")
      ? this.translate.instant('simcard.error.required_value')
      : this.iccid.hasError("minlength") || this.iccid.hasError('maxlength')
        ? this.translate.instant('simcard.error.iccid_min_max')
        : "";
  }
  /**
  * Devuelve el mensaje de email incorrecto
  */
  getErrorMessageAccount() {
    return this.accountSelected.hasError("required")
      ? this.translate.instant('simcard.error.required_account')
      : "";
  }
}