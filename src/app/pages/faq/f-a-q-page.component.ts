import { Component, OnInit } from '@angular/core';
import {ToastController, PopoverController, NavController, ModalController, Platform} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';
import {SimModalESimsCompatibleAndroidDevicesComponent} from '../select-platform/sim-modal-e-sim-compatible-android-devices/sim-modal-e-sims-compatible-android-devices.component';
import {SimModalESimsInstructionsAndroidComponent} from '../sim-cards/sim-modal-e-sim-instructions-android/sim-modal-e-sims-instructions-android.component';
import {SimModalESimsInstructionsIosComponent} from '../sim-cards/sim-modal-e-sim-instructions-ios/sim-modal-e-sims-instructions-ios.component';

@Component({
  selector: 'app-support',
  templateUrl: './f-a-q-page.component.html',
  styleUrls: ['./f-a-q-page.component.scss'],
})
export class FAQPage implements OnInit {
  public eSIMQuestions: FAQ[];
  public otherQuestions: FAQ[];
  public numberQuestionsESIM = 6;
  public numberOtherQuestions = 6;

  constructor(
    public platform: Platform,
    private toastController: ToastController,
    private popoverController: PopoverController,
    private navController: NavController,
    private translateService: TranslateService,
    private modalController: ModalController,
  ) {
    this.loadQuestions();
  }

  loadQuestions() {
    this.eSIMQuestions = [];
    for (let i = 1; i <= this.numberQuestionsESIM; i++) {
      this.eSIMQuestions.push(
        {
          question: this.translateService.instant('faq.questions_e_sims.q_' + i),
          answers: this.translateService.instant('faq.questions_e_sims.r_' + i)
        }
      );
    }
    this.otherQuestions = [];
    for (let i = 1; i <= this.numberOtherQuestions; i++) {
      this.otherQuestions.push(
        {
          question: this.translateService.instant('faq.other_questions.q_' + i),
          answers: this.translateService.instant('faq.other_questions.r_' + i)
        }
      );
    }
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

  async openAndroidManual() {
    const modal = await this.modalController.create({
      component: SimModalESimsInstructionsAndroidComponent,
    });
    return await modal.present();
  }

  async openIOSManual() {
    const modal = await this.modalController.create({
      component: SimModalESimsInstructionsIosComponent,
    });
    return await modal.present();
  }

  isPlatformIos() {
    return this.platform.is('ios');
  }
}
