import {Component, OnInit} from '@angular/core';
import {ToastController, ModalController} from '@ionic/angular';
import {SimCardService} from 'src/app/services/sim-card/sim-card.service';
import {FormControl, Validators} from '@angular/forms';
import {ZonesService} from 'src/app/services/zones/zones.service';
import {ServiceAccountService} from 'src/app/services/service-account/service-account.service';
import {TranslateService} from '@ngx-translate/core';
import {OrderSimsVoyager} from 'src/app/models/order/order';
import {CourierService} from 'src/app/services/courier/courier.service';
import {Global} from 'src/app/models/global/global';
import {Courier} from 'src/app/models/courier/courier';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {LoadingService} from 'src/app/services/loading/loading.service';
import {VoyagerPlansService} from '../../../services/voyager-plans/voyager-plans.service';

@Component({
  selector: 'app-sim-modal-buy',
  templateUrl: './sim-modal-buy.component.html',
  styleUrls: ['./sim-modal-buy.component.scss'],
})
export class SimModalESimBuy implements OnInit {
  //----cantidad de sims
  public readonly maxSimsBuy = 5;
  public listSimsQuantity: any[] = Array.from({length: this.maxSimsBuy}, (mapV, value) => value + 1);
  public currencySimsSelected: FormControl;
  public quantitySimsSelected: FormControl;
  //----Lenguaje
  public language: string;
  listCurrency: string[] = ['USD', 'EUR'];
  private pricingEsims: any;

  constructor(
    private loadingService: LoadingService,
    private toastController: ToastController,
    private modalController: ModalController,
    private simService: SimCardService,
    private zonesService: ZonesService,
    private serviceAccountService: ServiceAccountService,
    private translate: TranslateService,
    private courierService: CourierService,
    private iab: InAppBrowser,
    private voyagerPlansService: VoyagerPlansService,
  ) {
    this.currencySimsSelected = new FormControl(null, Validators.required);
    this.quantitySimsSelected = new FormControl(null, Validators.required);
    this.language = this.translate.currentLang;
    this.getPrices();
  }

  /**
   * Obtener precios
   */
  getPrices() {
    this.loadingService.presentLoading().then(() => {
      this.voyagerPlansService.getPricingEsimsByOrganization(Global.organization_id).subscribe((res: any) => {
        this.loadingService.dismissLoading();
        const pricingArray: any[] = res.body?.results;
        if (!pricingArray || pricingArray.length === 0) {
          this.presentToastError(this.translate.instant('simcard.error.cannot_buy_package'));
          this.modalController.dismiss();
        } else {
          this.pricingEsims = pricingArray.find(p => p.organization?.id === Global.organization_id);
        }
      }, err => {
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('simcard.error.cannot_buy_package'));
      });
    });
  }

  ngOnInit() {
  }

  buy() {
    if (this.quantitySimsSelected.valid) {
      this.loadingService.presentLoading().then(() => {
        const order: any = {
          quantity: +this.quantitySimsSelected.value,
          currency: this.currencySimsSelected.value,
          organization: +Global.organization_id,
        };
        this.simService.purchaseESims(order).subscribe(res => {
          this.presentToastOk(this.translate.instant('simcard.data.buy_sims.purcahse_ok'));
          this.loadingService.dismissLoading().then(() => {
            this.modalController.dismiss(res.body?.esims);
          });
        }, err => {
          console.log(err);
          this.loadingService.dismissLoading();
          if (err.status === 400 && err.error.details == 'Apparently the requested amount is not possible') {
            this.presentToastError(this.translate.instant('simcard.data.buy_sim_type_e_sim.not_quantity_sims'));
          } else if ((err.status == 400 || err.status == 402) && err.error.detail == 'Hasn\'t enough money') {
            this.presentToastError(this.translate.instant('simcard.error.not_enough_money'));
          } else {
            this.presentToastError(this.translate.instant('simcard.error.cannot_buy_package'));
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

  getPriceOfThisSims() {
    const currency = this.currencySimsSelected.value;
    const quantity = +this.quantitySimsSelected.value;
    if (currency === 'USD') {
      return (this.quantitySimsSelected.value * this.pricingEsims.customer_price_usd) + ' $';
    } else {
      return (this.quantitySimsSelected.value * this.pricingEsims.customer_price_eur) + ' €';
    }
  }
}
