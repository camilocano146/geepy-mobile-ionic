import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SimCardService } from 'src/app/services/sim-card/sim-card.service';
import { ServiceAccountService } from 'src/app/services/service-account/service-account.service';

@Component({
  selector: 'sim-modal-import-iccid-page',
  templateUrl: './sim-modal-import-iccid.html',
  encapsulation: ViewEncapsulation.None
})
export class SimModalImportICCID implements OnInit{


  public iccid: FormControl;
  public serviceAccountsList: any[];
  public accountSelected: FormControl;

  constructor(
    public modalController: ModalController,
    private translate: TranslateService,
    public toastController: ToastController,
    private simCardService: SimCardService,
    private serviceAccountService: ServiceAccountService) {
    this.iccid = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(21)]);
    this.accountSelected = new FormControl('', Validators.required);
  }

  ngOnInit(): void {
    this.serviceAccountService.getServicesAccounts().subscribe(res => {
      if (res.status == 200) {
        this.serviceAccountsList = res.body;
      }
    }, err => {
      this.presentToastError("We couldn't get service accounts.");
    });
  }

  import() {
    if (this.iccid.valid ) {
      const iccid = {
        iccid: this.iccid.value,
        account: this.accountSelected.value.id
      }
      this.simCardService.registerSimCardByICCID(iccid).subscribe(res => {
        if (res.status == 201) {
          this.presentToastOk("Sim card imported successfully");
          this.modalController.dismiss("imported");
        }
      }, err => {
        console.log(err);
        if(err.status == 400 && err.error.Details == "Can't create sim, this was registred previosly"){
          this.presentToastWarning("Can't import Sim card, this was imported previosly.");
        } else {
          this.presentToastError(this.translate.instant('platform-one.sim-card.import-iccid.error'));
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

 /**
   * Devuelve el mensaje de email incorrecto
   */
  getErrorMessageCode() {
    return this.iccid.hasError("required")
      ? this.translate.instant('login.error.required_value')
      : this.iccid.hasError("minlength") || this.iccid.hasError('maxlength')
      ? this.translate.instant('login.error.code-axx')
        : "";
  }

   /**
   * Devuelve el mensaje de email incorrecto
   */
  getErrorMessageAccount() {
    return this.accountSelected.hasError("required")
      ? this.translate.instant('login.error.required_value')
        : "";
  }


}