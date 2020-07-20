import { Component, OnInit } from '@angular/core';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { TariffRechargeService } from 'src/app/services/tariff-recharge/tariff-recharge.service';
import { ToastController, ModalController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BillingService } from 'src/app/services/billing/billing.service';
import { FormControl, Validators } from '@angular/forms';
import { PaymentPaypal } from 'src/app/models/payment/payment-paypal';
import { TariffRecharge } from 'src/app/models/tarif-recharge/tariff-recharge';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-transacitions-modal-paypal',
  templateUrl: './transacitions-modal-paypal.component.html',
  styleUrls: ['./transacitions-modal-paypal.component.scss'],
})
export class TransacitionsModalPaypalComponent implements OnInit {

  //-----Lista de tarifas
  public tarifsList: any[];
  public tariffSelected: FormControl;
  public currency: FormControl;
  public usd_tariffs: TariffRecharge[];
  public eur_tariffs: TariffRecharge[];

  public coupon: FormControl;

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
    this.currency = new FormControl('USD', Validators.required);
    this.usd_tariffs = [];
    this.eur_tariffs = [];
    this.coupon = new FormControl('');
  }

  ngOnInit() {
    this.tariffRechargeService.getTariffsRecharge().subscribe(res => {
      if (res.status == 200) {
        this.tarifsList = res.body;
        this.tarifsList.forEach(element => {
          if (element.currency.acronym == 'USD') {
            this.usd_tariffs.push(element);
          } else if (element.currency.acronym == 'EUR') {
            this.eur_tariffs.push(element);
          }
        });
        this.usd_tariffs.sort((a, b) => +a.value - +b.value);
        this.eur_tariffs.sort((a, b) => +a.value - +b.value);
      }
    }, err => {
      this.presentToastError(this.transalte.instant('payments.error.no_load_tariffs'));
    });
  }

  payWithPaypal() {
    if (this.coupon.value != '') {
      const data_coupon = {
        coupon: this.coupon.value
      }
      this.billingService.validateCoupon(data_coupon).subscribe(res => {
        console.log(res);
        this.payPal.init({
          PayPalEnvironmentProduction: 'AbLBe4TU77EfIp7LFNZTdbFnjKw_h_IfB-MAT9nNpyDxLfal1GLBwJ87dZpGIg-krvLJgMYQlZSlB0My',
          PayPalEnvironmentSandbox: 'AeKo_AMJsBwc-vHrp49WFP0m7WevJT_vBzJtWDiLpj4YAselYK8sFUHBqISAhRlIQiv98cneMu1Dktej'
        }).then(() => {
          // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
          this.payPal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration({
            // Only needed if you get an "Internal Service Error" after PayPal login!
            //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
          })).then(() => {
            let tarifWithTax = +this.tariffSelected.value.value + (+this.tariffSelected.value.value * 0.06) + 0.30;
            let payment = new PayPalPayment("" + tarifWithTax, this.tariffSelected.value.currency.acronym, 'Recharge in Geepy Connect', 'sale');
            this.payPal.renderSinglePaymentUI(payment).then((res) => {
              // Successfully paid
              let payment: PaymentPaypal = new PaymentPaypal(this.tariffSelected.value.id, res.response.id, this.tariffSelected.value.currency.id);
              if(this.coupon.value != ''){
                payment.coupon = this.coupon.value;
              }
              this.billingService.loadBalancePaypal(payment).subscribe(res => {
                if (res.status == 200) {
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
      }, err => {
        console.log(err);
        this.presentToastError(this.transalte.instant('payments.paypal.err_coupon'));
      });
    } else {
      this.payPal.init({
        PayPalEnvironmentProduction: 'AbLBe4TU77EfIp7LFNZTdbFnjKw_h_IfB-MAT9nNpyDxLfal1GLBwJ87dZpGIg-krvLJgMYQlZSlB0My',
        PayPalEnvironmentSandbox: 'AeKo_AMJsBwc-vHrp49WFP0m7WevJT_vBzJtWDiLpj4YAselYK8sFUHBqISAhRlIQiv98cneMu1Dktej'
      }).then(() => {
        // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
        this.payPal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration({
          // Only needed if you get an "Internal Service Error" after PayPal login!
          //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
        })).then(() => {
          let tarifWithTax = +this.tariffSelected.value.value + (+this.tariffSelected.value.value * 0.06) + 0.30;
          let payment = new PayPalPayment("" + tarifWithTax, this.tariffSelected.value.currency.acronym, 'Recharge in Geepy Connect', 'sale');
          this.payPal.renderSinglePaymentUI(payment).then((res) => {
            // Successfully paid
            let payment: PaymentPaypal = new PaymentPaypal(this.tariffSelected.value.id, res.response.id, this.tariffSelected.value.currency.id);
            this.billingService.loadBalancePaypal(payment).subscribe(res => {
              if (res.status == 200) {
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