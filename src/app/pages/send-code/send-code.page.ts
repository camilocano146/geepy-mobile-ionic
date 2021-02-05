import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { VerifyEmail } from 'src/app/models/reset-password/verify-email';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'src/app/services/loading/loading.service';


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
    private loadingService: LoadingService,
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
      this.loadingService.presentLoading().then(() => {
        let email: VerifyEmail = new VerifyEmail(this.emailRecovery.value.toLowerCase());
        this.authenticationService
          .sendEmailrecoveryPassword(email)
          .subscribe(res => {
            console.log(res);
            if (res.detail == "email sent") {
              this.presentToastOk(this.translate.instant('send_code.data.code_sent'));
              this.loadingService.dismissLoading().then(()=> {
                this.navCotroller.navigateRoot("reset-password");
              });
            }
          }, err => {
            console.log(err);
            this.loadingService.dismissLoading();
            if (err.error.detail == "email don't exist") {
              this.presentToastError(this.translate.instant('send_code.error.error-user-not-found'));
            } else if (err.status == 500) {
              this.presentToastError(this.translate.instant('reset_password.error.server_error'));
            } else {
              this.presentToastError(this.translate.instant('reset_password.error.connection_internet'));
            }
        });
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
