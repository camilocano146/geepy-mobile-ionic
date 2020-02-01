import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavParams, PopoverController, Events, AlertController, NavController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { AppRate } from '@ionic-native/app-rate/ngx';

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
    private navController: NavController) {
    const preferences = {
      displayAppName: 'Geepy Mobile',
      usesUntilPrompt: 5,
      storeAppURL: {
        //ios: '<my_app_id>',
        android: 'market://details?id=com.geepy.mobile'
      },
      customLocale: {
        title: "¿Te importaría calificanos?",
        message: "Valoramos tus comentarios! Tómate un momento para contarnos que piensas.",
        cancelButtonLabel: 'No gracias',
        rateButtonLabel: 'Calificar',
        laterButtonLabel: 'Preguntar luego',
        appRatePromptTitle: '¿Te gusta %@?',
        yesButtonLabel: "Si",
        noButtonLabel: "No realmente",
      },
      callbacks: {
        handleNegativeFeedback: function () {
          window.open('mailto:feedback@example.com', '_system');
        },
        onRateDialogShow: function (callback) {
          callback(1) // cause immediate click on 'Rate Now' button
        },
        onButtonClicked: function (buttonIndex) {
          console.log("onButtonClicked -> " + buttonIndex);
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
      header: 'Cerrar sesión',
      message: '¿Estás seguro?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.localStorageService.removeToken();
            this.navController.navigateBack("");
            this.eventFromPopover();
          }
        }, {
          text: 'Cancelar',
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

  rateThisApp() {
console.log("entre");
    this.appRate.promptForRating(true);
  }
}
