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
       // console.log(this.tarifsList);
      }
    }, err => {
      this.presentToastError("We couldn't get tariffs.");
    });
  }


  payWithPaypal() {
    console.log("Pay ????");

    console.log(this.tariffSelected.value);

    this.payPal.init({
      PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
      PayPalEnvironmentSandbox: 'AeKo_AMJsBwc-vHrp49WFP0m7WevJT_vBzJtWDiLpj4YAselYK8sFUHBqISAhRlIQiv98cneMu1Dktej'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment(this.tariffSelected.value.value, "USD", 'Description', 'sale');
        console.log(payment);
        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          console.log(res);
          // Successfully paid
          let payment: PaymentPaypal = new PaymentPaypal(this.tariffSelected.value.id,res.response.id, this.tariffSelected.value.currency.id);
          console.log(payment);
          this.billingService.loadBalancePaypal(payment).subscribe(res => {
            console.log(res);
            if(res.status == 200){
              this.presentToastOk("Successfull payment.");
              this.modalController.dismiss("created");
            }
          }, err => {
            console.log(err);
            this.presentToastError("No se pudo guardar el pago en la app pero este se realizo correctamente. Por favor pongase en contacto con el administrador del sitio.");
          });
          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }

          


        }, (err) => {
          // Error or render dialog closed without being successful
          console.log(err);
        });
      }, (err) => {
        // Error or render dialog closed without being successful
        console.log(err);
      });
    }, (err) => {
      // Error or render dialog closed without being successful
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