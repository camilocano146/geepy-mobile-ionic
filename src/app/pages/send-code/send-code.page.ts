import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { VerifyEmail } from 'src/app/models/reset-password/verify-email';
import { TranslateService } from '@ngx-translate/core';


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
  /** Focus del teclado*/
  public isKeyboardOpen: boolean;

  constructor(
    public navCotroller: NavController,
    private authenticationService: AuthenticationService,
    public toastController: ToastController,
    private translate: TranslateService
  ) {
    this.emailRecovery = new FormControl("", [Validators.required, Validators.email]);
    this.isKeyboardOpen = false;
  }

  ngOnInit() {

  }

  sendCode() {
    if (this.emailRecovery.valid) {
      let email: VerifyEmail = new VerifyEmail(this.emailRecovery.value.toLowerCase());
      this.authenticationService
        .sendEmailrecoveryPassword(email)
        .subscribe(res => {
          console.log(res);
          if (res.detail == "email sent") {
            this.presentToastOk(this.translate.instant('send_code.data.code_sent'));
          }
          this.navCotroller.navigateRoot("reset-password");
        }, err => {
          console.log(err);
          if (err.error.detail == "email don't exist") {
            this.presentToastError(this.translate.instant('send_code.error.error-user-not-found'));
          }
        });
    }
  }

  focus() {
    this.isKeyboardOpen = true;
  }
  focusout() {
    this.isKeyboardOpen = false;
  }

  /**
   * Devuelve el mensaje de email de recuperación incorrecto
   */
  getErrorMessageEmailRecovery() {
    return this.emailRecovery.hasError("required")
      ? this.translate.instant('send_code.error.required_value')
      : this.emailRecovery.hasError("email")
        ? this.translate.instant('send_code.error.error_email')
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