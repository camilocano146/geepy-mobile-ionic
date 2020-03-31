import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SimCardService } from 'src/app/services/sim-card/sim-card.service';
import { ServiceAccountService } from 'src/app/services/service-account/service-account.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'sim-modal-import-onum-page',
  templateUrl: './sim-modal-import-onum.html',
  encapsulation: ViewEncapsulation.None
})
export class SimModalImportONUM implements OnInit{


  public onum: FormControl;
  public serviceAccountsList: any[];
  public accountSelected: FormControl;

  constructor(
    private loadingService: LoadingService,
    public modalController: ModalController,
    private translate: TranslateService,
    public toastController: ToastController,
    private simCardService: SimCardService,
    private serviceAccountService: ServiceAccountService) {
    this.onum = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(21)]);
    this.accountSelected = new FormControl('', Validators.required);
  }

  ngOnInit(): void {
    this.loadingService.presentLoading().then(()=>{
      this.serviceAccountService.getServicesAccounts().subscribe(res => {
        if (res.status == 200) {
          this.serviceAccountsList = res.body;
        }
      }, err => {
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('simcard.error.services_account'));
      });
    });
  }

  import() {
    if (this.onum.valid ) {
      this.loadingService.presentLoading().then( ()=>{
        const onum = {
          msisdn: this.onum.value,
          account: this.accountSelected.value.id
        }
        this.simCardService.registerSimCardByONUM(onum).subscribe(res => {
          if (res.status == 201) {
            this.presentToastOk(this.translate.instant('simcard.data.import_onum.data.import_ok'));
            this.loadingService.dismissLoading().then( ()=>{
              this.modalController.dismiss("imported");
            });
          }
        }, err => {
          console.log(err);
          this.loadingService.dismissLoading();
          if(err.status == 400 && err.error.Details == "Can't create sim, this was registred previosly"){
            this.presentToastError(this.translate.instant('simcard.error.previus_imported'));
          } else {
            this.presentToastError(this.translate.instant('simcard.error.error_register'));
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
 /**
   * Devuelve el mensaje de email incorrecto
   */
  getErrorMessageCode() {
    return this.onum.hasError("required")
      ? this.translate.instant('simcard.error.required_value')
      : this.onum.hasError("minlength") || this.onum.hasError('maxlength')
      ? this.translate.instant('simcard.error.onum_min_max')
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