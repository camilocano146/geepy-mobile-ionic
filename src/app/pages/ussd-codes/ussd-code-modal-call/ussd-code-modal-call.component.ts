import { Component, OnInit, Input } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-ussd-code-modal-call',
  templateUrl: './ussd-code-modal-call.component.html',
  styleUrls: ['./ussd-code-modal-call.component.scss'],
})
export class UssdCodeModalCallComponent implements OnInit {
  /**
   * Lenguaje
   */
  public language: string;
  /**
  * Info de la sim actual
  */
  @Input() data: any;

  constructor(
    public toastController: ToastController,
    public modalController: ModalController,
    private callNumber: CallNumber,
    private translate: TranslateService
  ) {
    this.language = this.translate.currentLang;
  }

  ngOnInit() {
  }

  callToCode(){
      this.callNumber.callNumber(this.data.code, true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));
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
}
