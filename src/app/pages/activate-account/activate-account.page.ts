import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { VerifyEmail } from 'src/app/models/reset-password/verify-email';
import { ActivationCode } from 'src/app/models/user/code-activation/activation-code';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.page.html',
  styleUrls: ['./activate-account.page.scss'],
})
export class ActivateAccountPage implements OnInit {
  /**
   * Mensaje de error
   */
  public errorMessage: string;
  /**
   * Email para enviar la contraseña
   */
  public code: FormControl;

  constructor(
    public navCotroller: NavController,
    private authenticationService: AuthenticationService,
    public toastController: ToastController,
    private translate: TranslateService,
  ) {
    this.code = new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
  }

  ngOnInit() {

  }

  sendCode() {
    if (this.code.valid) {
      this.authenticationService
        .sendActivationCode(new ActivationCode(this.code.value))
        .subscribe(res => {
          if (res.detail == "verified account") {
            this.presentToastOk(this.translate.instant('activate_account.data.account_verificated'));
            this.navCotroller.navigateBack([""]);
          }
        }, err => {
          if (err.error.detail == "code not found") {
            this.presentToastError(this.translate.instant('activate_account.error.wrong_code'));
          }
        });
    }
  }

  /**
   * Devuelve el mensaje de email de recuperación incorrecto
   */
  getErrorMessagecode() {
    return this.code.hasError("required")
      ? this.translate.instant('activate_account.error.required_value')
      : "";
  }
  getErrorMessageCode() {
    return this.code.hasError("minlength")
      ? this.translate.instant('activate_account.error.code_min_max')
      : this.code.hasError("maxlength")
        ? this.translate.instant('activate_account.error.code_min_max')
        : this.code.hasError("required")
          ? this.translate.instant('activate_account.error.required_value')
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