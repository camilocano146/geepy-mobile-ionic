import { Component, OnInit } from '@angular/core';
import { ToastController, PopoverController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {

  constructor(
    private toastController: ToastController,
    private popoverController: PopoverController,
    private navController: NavController,
    private translateService: TranslateService,) {
  }

  ngOnInit() {
  }

  goToHome(){
    this.navController.navigateRoot("home");
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
  async settingsPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      mode: 'ios',
    });
    return await popover.present();
  }

}
