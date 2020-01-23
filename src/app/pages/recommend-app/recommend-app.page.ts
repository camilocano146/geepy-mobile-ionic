import { Component, OnInit } from '@angular/core';
import { ToastController, PopoverController, NavController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';
import { FormControl, Validators } from '@angular/forms';
import { RecommendService } from 'src/app/services/recommend/recommend.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recommend-app',
  templateUrl: './recommend-app.page.html',
  styleUrls: ['./recommend-app.page.scss'],
})
export class RecommendAppPage implements OnInit {
  /**Emial del recomendado */
  public email: FormControl;

  constructor(
    private toastController: ToastController,
    private popoverController: PopoverController,
    private navController: NavController,
    private recommendService: RecommendService,
    private translateService: TranslateService,) {
    this.email = new FormControl('', [Validators.email, Validators.required]);
  }

  ngOnInit() {
  }


  goToHome(){
    this.navController.navigateRoot("home");
  }

  sendEmail(){
    if(this.email.valid){
      const data = {
        email: this.email.value.toLowerCase()
      }
      console.log(data);
      this.recommendService.sendRecomendation(data).subscribe(res => {
        console.log(res);
        if(res.status == 201){
          this.presentToastOk(this.translateService.instant('recommend.data.refered_ok'));
        }
      }, err => {
        console.log(err);
        if(err.status == 400 && err.error.email[0] == "Este campo debe ser único."){
          this.presentToastError(this.translateService.instant('recommend.error.email_unique'));
        }
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