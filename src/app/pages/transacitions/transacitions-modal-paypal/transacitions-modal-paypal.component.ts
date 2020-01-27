import { Component, OnInit } from '@angular/core';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { TariffRechargeService } from 'src/app/services/tariff-recharge/tariff-recharge.service';
import { ToastController, ModalController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BillingService } from 'src/app/services/billing/billing.service';
import { FormControl, Validators } from '@angular/forms';
import { PaymentPaypal } from 'src/app/models/payment/payment-paypal';

@Component({
  selector: 'app-transacitions-modal-paypal',
  templateUrl: './transacitions-modal-paypal.component.html',
  styleUrls: ['./transacitions-modal-paypal.component.scss'],
})
export class TransacitionsModalPaypalComponent implements OnInit {

  //-----Lista de tarifas
  public tarifsList: any[];
  public tariffSelected: FormControl;

  constructor(
    private tariffRechargeService: TariffRechargeService,
    private toastController: ToastController,
    private modalController: ModalController,
    public loadingCtrl: LoadingController,
    private transalte: TranslateService,
    private billingService: BillingService,
    private payPal: PayPal) {
      this.tarifsList = [];
    this.tariffSelected = new FormControl('', Validators.required);
    }

  ngOnInit() {
    this.tariffRechargeService.getTariffsRecharge().subscribe(res => {
      if (res.status == 200) {
        this.tarifsList = res.body;
      }
    }, err => {
      this.presentToastError(this.transalte.instant('payments.error.no_load_tariffs'));
    });
  }


  payWithPaypal() {
    this.payPal.init({
      PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
      PayPalEnvironmentSandbox: 'AeKo_AMJsBwc-vHrp49WFP0m7WevJT_vBzJtWDiLpj4YAselYK8sFUHBqISAhRlIQiv98cneMu1Dktej'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let tarifWithTax = +this.tariffSelected.value.value + (+this.tariffSelected.value.value * 0.06) + 0.30;
        let payment = new PayPalPayment(""+tarifWithTax, this.tariffSelected.value.currency.acronym, 'Recharge in MS One Mobile', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          // Successfully paid
          let payment: PaymentPaypal = new PaymentPaypal(this.tariffSelected.value.id,res.response.id, this.tariffSelected.value.currency.id);
          this.billingService.loadBalancePaypal(payment).subscribe(res => {
            if(res.status == 200){
              this.presentToastOk(this.transalte.instant('payments.paypal.payment_ok'));
              this.modalController.dismiss("created");
            }
          }, err => {
            console.log(err);
            this.presentToastError(this.transalte.instant('pay_not_saved'));
          });

        }, (err) => {
          // Error or render dialog closed without being successful
          this.presentToastError(this.transalte.instant('payments.error.ep1'));
          console.log(err);
        });
      }, (err) => {
        // Error or render dialog closed without being successful
        this.presentToastError(this.transalte.instant('payments.error.ep1'));
        console.log(err);
      });
    }, (err) => {
      // Error or render dialog closed without being successful
      this.presentToastError(this.transalte.instant('payments.error.ep1'));
      console.log(err)
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