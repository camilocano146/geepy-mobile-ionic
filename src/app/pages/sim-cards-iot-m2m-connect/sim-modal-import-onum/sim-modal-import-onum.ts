import { Component, Input, ViewEncapsulation, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SimCardService } from 'src/app/services/sim-card/sim-card.service';
import { ServiceAccountService } from 'src/app/services/service-account/service-account.service';
import { Bic } from 'src/app/models/sim-card/bic';

@Component({
  selector: 'sim-modal-import-onum-page',
  templateUrl: './sim-modal-import-onum.html',
  encapsulation: ViewEncapsulation.None
})
export class SimModalImportONUM implements OnInit {


  public batchP1: FormControl;
  public batchP2: FormControl;
  public batchP3: FormControl;
  public batchP4: FormControl;

  public serviceAccountsList: any[];
  public accountSelected: FormControl;

  constructor(
    public modalController: ModalController,
    private translate: TranslateService,
    public toastController: ToastController,
    private simCardService: SimCardService,
    private serviceAccountService: ServiceAccountService) {
    this.batchP1 = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
    this.batchP2 = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
    this.batchP3 = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
    this.batchP4 = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
    this.accountSelected = new FormControl('', Validators.required);
  }

  ngOnInit(): void {
    this.serviceAccountService.getServicesAccountsIotM2MConnect().subscribe(res => {
      if (res.status == 200) {
        this.serviceAccountsList = res.body;
      }
    }, err => {
      this.presentToastError(this.translate.instant('simcard.error.services_account'));
    });
  }

  import() {
    if (this.batchP1.valid &&
      this.batchP2.valid &&
      this.batchP3.valid &&
      this.batchP4.valid &&
      this.accountSelected.valid) {
      let batch: Bic = new Bic((this.batchP1.value +
        this.batchP2.value +
        this.batchP3.value +
        this.batchP4.value).toUpperCase());
      batch.account = this.accountSelected.value.id;
      this.simCardService.registerSimCard(batch).subscribe(res => {
        if (res.status == 201) {
          this.presentToastOk(this.translate.instant('simcard.data.import_onum.data.import_ok'));
          this.modalController.dismiss("imported");
        }
      }, err => {
        console.log(err);
        if (err.status == 400 && err.error.Details == "Can't create sim, this was registred previosly") {
          this.presentToastError(this.translate.instant('simcard.error.previus_imported'));
        } else {
          this.presentToastError(this.translate.instant('simcard.error.error_register'));
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
  getErrorMessageAccount() {
    return this.accountSelected.hasError("required")
      ? this.translate.instant('simcard.error.required_account')
      : "";
  }
}
