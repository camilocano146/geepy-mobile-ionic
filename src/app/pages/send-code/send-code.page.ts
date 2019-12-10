import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { NavController, NavParams, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { VerifyEmail } from 'src/app/models/reset-password/verify-email';


@Component({
  selector: 'app-send-code',
  templateUrl: './send-code.page.html',
  styleUrls: ['./send-code.page.scss'],
})
export class SendCodePage implements OnInit {
  /**
   * Email para enviar la contraseña
   */
  public emailRecovery: FormControl;

  constructor(
    public navCotroller: NavController,
    private authenticationService: AuthenticationService,
    public toastController: ToastController
  ) {
    this.emailRecovery = new FormControl("", [
      Validators.required,
      Validators.email
    ]);
  }

  ngOnInit() {

  }

  sendCode() {
    if (this.emailRecovery.valid) {
      let email: VerifyEmail = new VerifyEmail(this.emailRecovery.value.toLowerCase());
      this.authenticationService
        .sendEmailrecoveryPassword(email)
        .subscribe(res => {
          if (res.detail == "email sent") {
            this.presentToastOk("Code send");
          }
          this.navCotroller.navigateRoot("reset-password");
        }, err => {
          if (err.error.detail == "email don't exist") {
            this.presentToastError('login.sign-in.error-user-not-found');
          }
        });
    }
  }

  /**
   * Devuelve el mensaje de email de recuperación incorrecto
   */
  getErrorMessageEmailRecovery() {
    return this.emailRecovery.hasError("required")
      ? ""
      : this.emailRecovery.hasError("email")
        ? "this.translate.instant('validations.error-email')"
        : "";
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