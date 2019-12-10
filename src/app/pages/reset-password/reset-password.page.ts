import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { ResetPassword } from 'src/app/models/reset-password/reset-password';
import sha1 from 'js-sha1'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  /**
  * Codigo de restauración
  */
  public code: FormControl;
  /**
   * Validador de la contraseña
   */
  public password: FormControl;
  /**
   * Confirmación de la contraseña
   */
  public confirmPassword: FormControl;

  public hide: boolean;
  public Chide: boolean;

  constructor(
    public navCotroller: NavController,
    private authenticationService: AuthenticationService,
    public toastController: ToastController,
    private translate: TranslateService
  ) {
    this.hide = true;
    this.Chide = true;
    this.password = new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
    this.confirmPassword = new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
    this.code = new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(8)
    ]);
  }

  ngOnInit() {

  }

  changePassword() {
    if (
      this.code.valid &&
      this.password.valid &&
      this.confirmPassword.valid &&
      this.password.value == this.confirmPassword.value
    ) {
      let resetPassword: ResetPassword = new ResetPassword(
        sha1(this.password.value),
        sha1(this.confirmPassword.value),
        this.code.value
      );
      this.authenticationService.resetPassword(resetPassword).subscribe(
        res => {
          if (res.detail == "Password changed, please login") {
            this.presentToastOk("Password changed, please Sign in.");
            this.navCotroller.navigateForward([""]);
          }
        },
        err => {
          if (err.status == 422 && err.error.detail == "unknown code") {
            this.presentToastError("this.translate.instant('login.reset-password.wrong code')");
          }
        }
      );
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
  /**
 * Devuelve el mensaje de password incorrecto
 */
  getErrorMessagePassword() {
    return this.password.hasError("required")
      ? this.translate.instant('validations.required-value')
      : this.password.hasError("pattern")
        ? this.translate.instant('validations.error-password')
        : "";
  }
  /**
   * Devuelve el mensaje de confimar password incorrecto
   */
  getErrorMessageConfirmPassword() {
    return this.confirmPassword.hasError("required")
      ? this.translate.instant('validations.required-value')
      : this.confirmPassword.hasError("pattern")
        ? this.translate.instant('validations.error-password')
        : "";
  }
  getErrorMessageCode() {
    return this.code.hasError("minlength")
      ? this.translate.instant('validations.error-8-characteres')
      : this.code.hasError("maxlength")
        ? this.translate.instant('validations.error-8-characteres')
        : this.code.hasError("required")
          ? this.translate.instant('validations.required-value')
          : "";
  }
}


