import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavParams, PopoverController, Events, AlertController, NavController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PopoverComponent implements OnInit {

  constructor(
    private popoverController: PopoverController,
    private alertController: AlertController,
    private localStorageService: LocalStorageService,
    private navController: NavController) {
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
}
