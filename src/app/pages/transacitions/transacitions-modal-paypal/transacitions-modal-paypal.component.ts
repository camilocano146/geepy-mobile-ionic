import { Component, OnInit, ViewChild } from '@angular/core';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { TariffRechargeService } from 'src/app/services/tariff-recharge/tariff-recharge.service';
import { ToastController, ModalController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BillingService } from 'src/app/services/billing/billing.service';
import { FormControl, Validators } from '@angular/forms';
import { PaymentPaypal } from 'src/app/models/payment/payment-paypal';
import { TariffRecharge } from 'src/app/models/tarif-recharge/tariff-recharge';
import {ICreateOrderRequest, NgxPaypalComponent, PayPalScriptService} from 'ngx-paypal';
import {IOnApproveCallbackData} from 'ngx-paypal/lib/models/paypal-models';
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
  public formControlCurrency: FormControl;
  public usd_tariffs: TariffRecharge[];
  public eur_tariffs: TariffRecharge[];
  public coupon: FormControl;
  public payPalConfigUsd: any;
  public payPalConfigEur: any;
  public isValidCoupon = true;
  public currentCoupon: string;
  public preloadValidCoupon: boolean;
  public orderId: string;
  @ViewChild('paypalComponentUSD') paypalComponentUSD: NgxPaypalComponent;
  @ViewChild('paypalComponentEUR') paypalComponentEUR: NgxPaypalComponent;
  public showPayPanUSD: boolean = true;
  public showPayPanEUR: boolean;
  private readonly clientIdProduction = 'AbLBe4TU77EfIp7LFNZTdbFnjKw_h_IfB-MAT9nNpyDxLfal1GLBwJ87dZpGIg-krvLJgMYQlZSlB0My';

  constructor(
    private tariffRechargeService: TariffRechargeService,
    private toastController: ToastController,
    private modalController: ModalController,
    public loadingCtrl: LoadingController,
    private transalte: TranslateService,
    private billingService: BillingService,
    private loadingService: LoadingService,
    private payPal: PayPal) {
    this.tarifsList = [];
    this.tariffSelected = new FormControl('', Validators.required);
    this.formControlCurrency = new FormControl('USD', Validators.required);
    this.usd_tariffs = [];
    this.eur_tariffs = [];
    this.coupon = new FormControl('');
    this.payUsd(true);
    this.payEur(true);
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
    this.changeCurrency();
  }

  convertToFloatFixed2(value: number): number {
    try {
      return parseFloat(parseFloat('0' + value).toFixed(2));
    } catch (e) {
      return 0;
    }
  }

  payUsd(loadFirstTime?: boolean) {
    // this.presentToastError(this.tariffSelected.value);
    const tarifWithTax = +this.tariffSelected?.value?.value + (+this.tariffSelected?.value?.value * 0.06) + 0.30;
    // this.presentToastError(isNumber(tarifWithTax) + '');
    let amount = '' + this.convertToFloatFixed2(tarifWithTax);
    const currency = 'USD';
    if (loadFirstTime) {
      amount = '-1';
      this.payPalConfigUsd = this.buildPaypalConfig(currency, amount);
    } else {
      this.payPalConfigUsd.currency = currency;
      this.payPalConfigUsd.value = amount;
      this.payPalConfigUsd.createOrderOnClient = (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount,
            breakdown: {
              item_total: {
                currency_code: currency,
                value: amount
              }
            }
          },
          items: [{
            name: 'Recharge in iGlobalSat',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: currency,
              value: amount,
            },
          }]
        }]
      };
    }
  }

  payEur(loadFirstTime?: boolean) {
    // this.presentToastError(this.tariffSelected.value);
    const tarifWithTax = +this.tariffSelected?.value?.value + (+this.tariffSelected?.value?.value * 0.06) + 0.30;
    // this.presentToastError(isNumber(tarifWithTax) + '');
    let amount = '' + this.convertToFloatFixed2(tarifWithTax);
    const currency = 'EUR';
    if (loadFirstTime) {
      amount = '-1';
      this.payPalConfigEur = this.buildPaypalConfig(currency, amount);
    } else {
      this.payPalConfigEur.currency = currency;
      this.payPalConfigEur.value = amount;
      this.payPalConfigEur.createOrderOnClient = (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount,
            breakdown: {
              item_total: {
                currency_code: currency,
                value: amount
              }
            }
          },
          items: [{
            name: 'Recharge in iGlobalSat',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: currency,
              value: amount,
            },
          }]
        }]
      };
    }
  }

  private buildPaypalConfig(currency, amount: string): any {
    return {
      currency,
      value: amount,
      clientId: this.clientIdProduction,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount,
            breakdown: {
              item_total: {
                currency_code: currency,
                value: amount
              }
            }
          },
          items: [{
            name: 'Recharge in iGlobalSat',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: currency,
              value: amount,
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data: IOnApproveCallbackData, actions: any) => {
        this.orderId = data.orderID;
        // console.log('onApprove - transaction was approved, but not authorized', data, actions);
        // actions.order.get().then(details => {
        //   console.log('onApprove - you can get full order details inside onApprove: ', details);
        // });

        // this.presentToastOk(this.transalte.instant('payments.paypal.payment_ok'));
      },
      onClientAuthorization: (data) => {
        // Successfully paid
        let payment: PaymentPaypal = new PaymentPaypal(this.tariffSelected.value.id, this.orderId, this.tariffSelected.value.currency.id);
        if (this.coupon.value != '' && this.isValidCoupon) {
          payment.coupon = this.coupon.value;
        }
        this.billingService.loadBalancePaypal(payment).subscribe(res => {
          if (res.status == 200) {
            this.presentToastOk(this.transalte.instant('payments.paypal.payment_ok'));
            this.modalController.dismiss('created');
          }
        }, err => {
          console.log(err);
          this.presentToastError(this.transalte.instant('pay_not_saved'));
        });
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
        this.presentToastError(this.transalte.instant('payments.error.payment_bad'));
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
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

  changeCoupon(event: CustomEvent) {
    if (this.currentCoupon != this.coupon.value) {
      this.isValidCoupon = false;
    }
    if (this.coupon.value == '') {
      this.currentCoupon = '';
      this.isValidCoupon = true;
    }
  }

  validCoupon() {
    if (this.coupon.valid) {
      this.loadingService.presentLoading().then(value => {
        this.preloadValidCoupon = true;
        const data_coupon = {
          coupon: this.coupon.value
        };
        this.billingService.validateCoupon(data_coupon).subscribe(res => {
          console.log(res);
          this.currentCoupon = this.coupon.value;
          this.isValidCoupon = true;
          this.preloadValidCoupon = false;
          this.presentToastOk(this.transalte.instant('payments.paypal.valid_coupon'));
          this.loadingService.dismissLoading();
        }, err => {
          console.log(err);
          this.preloadValidCoupon = false;
          this.isValidCoupon = false;
          this.presentToastError(this.transalte.instant('payments.paypal.err_coupon'));
          this.loadingService.dismissLoading();
        });
      });
    } else {
      this.coupon.markAsTouched();
    }
  }

  changeCurrency() {
    this.showPayPanUSD = false;
    this.showPayPanEUR = false;
    let exist = false;
    let count = 0;
    if (this.formControlCurrency.value == 'USD') {
      var head = document.getElementsByTagName('head')[0];
      Array.prototype.forEach.call(head.children, (i) => {
        count++;
        if (i.id === 'ngx-paypal-script-elem-paypal') {
          exist = true;
          i.remove();
          const src = i.src?.toString();
          const split = src.toString().split('EUR');
          let srcResult = '';
          for (let j = 0; j < split.length; j++) {
            if (j !== split.length - 1) {
              srcResult += split[j] + 'USD';
            }
          }
          i.src = srcResult;
        }
        if (count === head.children.length && !exist) {
          const s = document.createElement('script');
          s.id = 'ngx-paypal-script-elem-paypal';
          s.src = `https://www.paypal.com/sdk/js?client-id=${this.clientIdProduction}&currency=USD&commit=true`;
          head.appendChild(s);
        }
      });
      setTimeout(() => {
        this.showPayPanUSD = true;
      }, 2000);
    } else if (this.formControlCurrency.value == 'EUR') {
      var head = document.getElementsByTagName('head')[0];
      Array.prototype.forEach.call(head.children, (i) => {
        count++;
        if (i.id === 'ngx-paypal-script-elem-paypal') {
          exist = true;
          i.remove();
          const src = i.src?.toString();
          const split = src.toString().split('USD');
          let srcResult = '';
          for (let j = 0; j < split.length; j++) {
            if (j !== split.length - 1) {
              srcResult += split[j] + 'EUR';
            }
          }
          i.src = srcResult;
        }
        if (count === head.children.length && !exist) {
          const s = document.createElement('script');
          s.id = 'ngx-paypal-script-elem-paypal';
          s.src = `https://www.paypal.com/sdk/js?client-id=${this.clientIdProduction}&currency=EUR&commit=true`;
          head.appendChild(s);
        }
      });
      setTimeout(() => {
        this.showPayPanEUR = true;
      }, 2000);
      // const s1 = document.createElement('script');
      // s1.id = 'xo-pptm';
      // s1.src = 'https://www.paypal.com/tagmanager/pptm.js?id=localhost&amp;t=xo&amp;v=5.0.202&amp;source=payments_sdk&amp;client_id=AfLsMx26wOQgvcKhWR0fxgAcJdDUotKmiMaRmN9wPw0T37wOrh0nJv2GgzcTl8iJ7OLg9P2e9Jpi0uC3&amp;vault=false';
      // head.appendChild(s1);
    }
    this.tariffSelected.reset();
  }
}
