import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { NotificationFCM } from 'src/app/models/notification-fcm/notification-fcm';
import { TranslateService } from '@ngx-translate/core';
import { SimCardService } from 'src/app/services/sim-card/sim-card.service';
import { RepurchasePackage } from 'src/app/models/package/RepurchasePackage';
import { BuyPackageTop } from 'src/app/models/package/BuyPackageTop';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-repurchase-package',
  templateUrl: './repurchase-package.page.html',
  styleUrls: ['./repurchase-package.page.scss'],
})
export class RepurchasePackagePage implements OnInit {

  /**
   * Date de la notificaión
   */
  public data: NotificationFCM;
  /**
   * Paquetes diponibles
   */
  public avaiablePackages: any[];
  /**
   * Moneda
   */
  public simCurrent: any;

  constructor(
    private loadingService: LoadingService,
    private navController: NavController,
    private toastController: ToastController,
    private simCardService: SimCardService,
    private alertController: AlertController,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.data = JSON.parse(localStorage.getItem('pc_to_expire'));
    this.searchAvailablePackages();

  }

  searchAvailablePackages() {
    this.loadingService.presentLoading().then(() => {
      let rPackage: RepurchasePackage = new RepurchasePackage(this.data.package_sim, "" + this.data.onum);
      this.simCardService.searchBestPackages(rPackage).subscribe(res => {
        this.avaiablePackages = res.body;
        this.avaiablePackages.sort((a, b) => a.activation_fee_usd - b.activation_fee_usd);
        this.getSimCardDetailsWithOutOtherServices();
      }, err => {
        console.log(err);
        this.loadingService.dismissLoading();
        if (err.status == 402 && err.error.detail == "Hasn't enough money") {
          this.presentToastError(this.translate.instant("simcard.error.not_enough_money"));
        } else if (err.status == 500) {
          this.presentToastError(this.translate.instant('repurchase.sim_no_exist'));
        } else if (err.status == 400 && err.error.discount.text == "Packet change terms were not met") {
          this.presentToastError(this.translate.instant('repurchase.terms_bad'));
        } else {
          this.presentToastError(this.translate.instant('repurchase.no_repurchase'));
        }
      });
    });
  }
  /**
       * Obtiene información de la sim
       */
  getSimCardDetailsWithOutOtherServices() {
    this.simCardService.getSimCardById(this.data.sim_id).subscribe(res => {
      if (res.status == 200) {
        this.simCurrent = res.body;
        this.loadingService.dismissLoading();
      }
    }, err => {
      console.log(err);
      this.loadingService.dismissLoading();
      this.presentToastError(this.translate.instant("simcard.error.no_details_sim"));
    });
  }


  /**
   * Activar paquete datos  
   */
  async activatePackage(item, packageToBuy, type) {
    let message = "";
    if (this.simCurrent.card_stat.card.curr == 'USD') {
      message = `${item.package_name} per ${item.activation_fee_usd} ${this.simCurrent.card_stat.card.curr}.`
    } else if (this.simCurrent.card_stat.card.curr == 'EUR') {
      message = `${item.package_name} per ${item.activation_fee_eur} ${this.simCurrent.card_stat.card.curr}.`
    }

    const alert = await this.alertController.create({
      header: this.translate.instant("simcard.data.settings.package.confirm_buy"),
      message: message,
      buttons: [
        {
          text: this.translate.instant("simcard.data.settings.package.btn_buy"),
          cssClass: "color: red",
          handler: () => {
            this.loadingService.presentLoading().then(() => {
              let pb = new BuyPackageTop(packageToBuy, type, 'yes');
              this.simCardService.addPackageToSim(this.data.sim_id, pb).subscribe(res => {
                if (res.status == 200) {
                  this.presentToastOk(this.translate.instant("simcard.data.package_purchased_ok"));
                  this.loadingService.dismissLoading().then(() => {
                    this.ngOnInit();
                  });
                }
              }, err => {
                this.loadingService.dismissLoading();
                console.log(err);
                if (err.status == 406 && err.error.detail == "Coupon not found or not match") {
                  this.presentToastError(this.translate.instant("simcard.error.wrong_coupon"));
                } else if (err.status == 400 && err.error.discount.text == "Card is blocked") {
                  this.presentToastError(this.translate.instant("simcard.error.sim_block"));
                } else if (err.status == 400 && err.error.discount.text == "Not enough money") {
                  this.presentToastError(this.translate.instant("simcard.error.not_enough_money"));
                } else {
                  this.presentToastError(this.translate.instant("simcard.error.cannot_buy_package"));
                }
              });
            });

          }
        }, {
          text: this.translate.instant("simcard.data.settings.package.btn_cancel"),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }
  /**
   * Va al inicio
   */
  goToHome() {
    this.navController.navigateRoot("home");
    localStorage.removeItem('pc_to_expire');
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
}
