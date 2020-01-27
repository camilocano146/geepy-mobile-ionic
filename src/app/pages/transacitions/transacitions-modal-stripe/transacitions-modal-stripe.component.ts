import { Component, OnInit } from '@angular/core';
import { TariffRechargeService } from 'src/app/services/tariff-recharge/tariff-recharge.service';
import { ToastController, ModalController, LoadingController } from '@ionic/angular';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BillingService } from 'src/app/services/billing/billing.service';
import { Payment } from 'src/app/models/payment/payment';
declare var Stripe;

@Component({
  selector: 'app-transacitions-modal-stripe',
  templateUrl: './transacitions-modal-stripe.component.html',
  styleUrls: ['./transacitions-modal-stripe.component.scss'],
})

export class TransacitionsModalStripeComponent implements OnInit {
  //-----Loading
  public isLoading: boolean;
  //-----Lista de tarifas
  public tarifsList: any[];
  public tariffSelected: FormControl;
  //-----Stripe
  //stripe = Stripe('pk_test_621PtH4KnimaOD6tYtPJ0GPp');
  stripe = Stripe('pk_live_lttbri0cTaHw0s4tD3vDije7');
  card: any;

  constructor(
    private tariffRechargeService: TariffRechargeService,
    private toastController: ToastController,
    private modalController: ModalController,
    public loadingCtrl: LoadingController,
    private transalte: TranslateService,
    private billingService: BillingService) {
    this.tarifsList = [];
    this.tariffSelected = new FormControl('', Validators.required);
  }

  ngOnInit() {
    this.setupStripe();
    this.tariffRechargeService.getTariffsRecharge().subscribe(res => {
      if (res.status == 200) {
        this.tarifsList = res.body;
      }
    }, err => {
      this.presentToastError(this.transalte.instant('payments.error.no_load_tariffs'));
    });
  }

  payWithStripe(result) {
    let payment: Payment = new Payment(result, this.tariffSelected.value.id, this.tariffSelected.value.currency.id);
    this.billingService.loadBalance(payment).subscribe(res => {
      if(res.status == 200){
        this.presentToastOk(this.transalte.instant('payments.stripe.payment_ok'));
        this.modalController.dismiss("created");
      }
    }, err => {
      console.log(err);
      if (err.status == 402 && err.error.message == "Your card was declined. Your request was in test mode, but used a non test (live) card. For a list of valid test cards, visit: https://stripe.com/docs/testing.") {
        this.presentToastError(this.transalte.instant('payments.error.credit_card_test'));
      } else if (err.status == 500 && err.error.detail == "the payment failed") {
        this.presentToastError(this.transalte.instant('payments.error.payment_bad'));
      } else {
        this.presentToastError(this.transalte.instant('payments.error.cannot_buy'));
      }
    });
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
  setupStripe() {
    let elements = this.stripe.elements();
    var style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    this.card = elements.create('card', { style: style });
    this.card.mount('#card-element');
    this.card.addEventListener('change', event => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        this.dismissLoading();
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    var form = document.getElementById('payment-form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      this.presentLoading();
      this.stripe.createSource(this.card).then(result => {
        if (result.error) {
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
          this.dismissLoading();
        } else {
          this.dismissLoading();
          this.payWithStripe(result.source.id);
        }
      });
    });
  }

  async presentLoading() {
    if (this.isLoading == true) {
      this.dismissLoading();
    }
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: this.transalte.instant('loader.loading')
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then(() => console.log(''));
        }
      });
    });
  }
  // Cierre del loading
  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log(''));
  }
}