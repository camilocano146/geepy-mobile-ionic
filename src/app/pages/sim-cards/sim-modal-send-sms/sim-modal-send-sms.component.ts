import { Component, OnInit, Input } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';
import { FormControl, Validators } from '@angular/forms';
import { SimCardService } from 'src/app/services/sim-card/sim-card.service';
import { SMS } from 'src/app/models/sms/sms';

@Component({
  selector: 'app-sim-modal-send-sms',
  templateUrl: './sim-modal-send-sms.component.html',
  styleUrls: ['./sim-modal-send-sms.component.scss'],
})
export class SimModalSendSmsComponent implements OnInit {

  /**
 * Info de la sim actual
 */
  @Input() sim_current: any;
  public textSMS: FormControl;
  public number: FormControl;

  constructor(
    public toastController: ToastController,
    public modalController: ModalController,
    private simCardService: SimCardService) {
    this.textSMS = new FormControl("", [Validators.required, Validators.minLength(1), Validators.maxLength(160)]);
    this.number = new FormControl("", [Validators.required, Validators.minLength(1), Validators.maxLength(30)]);
  }

  ngOnInit() {
  }

  sendSMS1() {
    if (this.number.valid && this.textSMS.valid) {
      let sms: SMS = new SMS(this.number.value, this.textSMS.value);
      this.simCardService.sendSMS1(this.sim_current, sms).subscribe(res => {
        this.presentToastOk("SMS sent successfully.");
        this.modalController.dismiss("sent");
      }, err => {
        if (err.status == 400 && err.error.sms.text == "Requested card not found") {
          this.presentToastError("Destinatary card not found.");
        } else if (err.status == 500) {
          this.presentToastError("Server error");
        } else {
          this.presentToastError("Error sendind sms.");
        }
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
}