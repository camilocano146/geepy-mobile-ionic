import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PopoverController, AlertController, NavController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { TranslateService } from '@ngx-translate/core';

interface AppRatePreferencesEnhanced {
  openUrl: (url: string) => void;
}

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PopoverComponent implements OnInit {

  constructor(
    private appRate: AppRate,
    private popoverController: PopoverController,
    private alertController: AlertController,
    private localStorageService: LocalStorageService,
    private navController: NavController,
    private translate: TranslateService) {
    const preferences = {
      displayAppName: 'Geepy Mobile',
      usesUntilPrompt: 5,
      storeAppURL: {
        ios: '1497412106',
        android: 'market://details?id=com.geepy.mobile'
      },
      customLocale: {
        title: this.translate.instant('rate.title'),
        message: this.translate.instant('rate.message'),
        cancelButtonLabel: this.translate.instant('rate.cancelButtonLabel'),
        rateButtonLabel: this.translate.instant('rate.rateButtonLabel'),
        laterButtonLabel: this.translate.instant('rate.laterButtonLabel'),
        appRatePromptTitle: this.translate.instant('rate.appRatePromptTitle') + '%@' + "?",
        yesButtonLabel: this.translate.instant('rate.yesButtonLabel'),
        noButtonLabel: this.translate.instant('rate.noButtonLabel'),
        feedbackPromptTitle: this.translate.instant('rate.feedbackPromptTitle')
      },
      callbacks: {
        handleNegativeFeedback: function () {
          window.open('mailto:geepybike1@gmail.com','_system');
        },
        onRateDialogShow: function (callback) {
          callback(1) // cause immediate click on 'Rate Now' button
        },
        onButtonClicked: function (buttonIndex) {
          console.log(buttonIndex);
        }
      },
      openUrl: (this.appRate.preferences as AppRatePreferencesEnhanced).openUrl
    };
    this.appRate.preferences = preferences;
  }

  ngOnInit() { }


  eventFromPopover() {
    this.popoverController.dismiss();
  }

  /**
 * Cerrar sesión
 */
  logOut() {
    this.presentAlertConfirm();
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: this.translate.instant('sign_out.header'),
      message: this.translate.instant('sign_out.text'),
      buttons: [
        {
          text: this.translate.instant('sign_out.btn_yes'),
          handler: () => {
            this.localStorageService.removeToken();
            this.navController.navigateBack("");
            this.eventFromPopover();
          }
        }, {
          text: this.translate.instant('sign_out.btn_cancel'),
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
   * Ir a USSD
   */
  goToUSSD() {
    this.navController.navigateRoot("ussd-codes");
    this.eventFromPopover();
  }
  /**
   * Ir a recomendar app
   */
  goToRecommend() {
    this.navController.navigateRoot("recommend-app");
    this.eventFromPopover();
  }
  /**
   * Ir support
   */
  goToSupport() {
    this.navController.navigateRoot("support");
    this.eventFromPopover();
  }
  /**
   * Calificar
   */
  rateThisApp() {
    this.appRate.promptForRating(true);
  }
}
