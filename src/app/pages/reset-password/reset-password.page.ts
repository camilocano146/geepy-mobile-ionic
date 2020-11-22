import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { ResetPassword } from 'src/app/models/reset-password/reset-password';
import sha1 from 'js-sha1'
import { LoadingService } from 'src/app/services/loading/loading.service';

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
    private loadingService: LoadingService,
    public navCotroller: NavController,
    private authenticationService: AuthenticationService,
    public toastController: ToastController,
    private translate: TranslateService
  ) {
    this.hide = true;
    this.Chide = true;
    this.password = new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16)]);
    this.confirmPassword = new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16)]);
    this.code = new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
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
      this.loadingService.presentLoading().then(() => {
        let resetPassword: ResetPassword = new ResetPassword(
          sha1(this.password.value),
          sha1(this.confirmPassword.value),
          this.code.value
        );
        this.authenticationService.resetPassword(resetPassword).subscribe(
          res => {
            if (res.detail == "Password changed, please login") {
              this.presentToastOk(this.translate.instant('reset_password.data.password_update'));
              this.loadingService.dismissLoading().then(() => {
                this.navCotroller.navigateForward(["login"]);
              });
            }
          },
          err => {
            console.log(err);
            this.loadingService.dismissLoading();
            if (err.status == 422 && err.error.detail == "unknown code") {
              this.presentToastError(this.translate.instant('reset_password.error.wrong_code'));
            } else if (err.status == 500) {
              this.presentToastError(this.translate.instant('reset_password.error.server_error'));
            } else {
              this.presentToastError(this.translate.instant('reset_password.error.connection_internet'));
            }
          });
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
  /**
 * Devuelve el mensaje de password incorrecto
 */
  getErrorMessagePassword() {
    return this.password.hasError("required")
      ? this.translate.instant('reset_password.error.required_value')
      : this.password.hasError("minlength") || this.password.hasError("maxlength")
        ? this.translate.instant('reset_password.error.password_min_max')
        : "";
  }
  /**
   * Devuelve el mensaje de confimar password incorrecto
   */
  getErrorMessageConfirmPassword() {
    return this.confirmPassword.hasError("required")
      ? this.translate.instant('reset_password.error.required_value')
      : this.confirmPassword.hasError("minlength") || this.confirmPassword.hasError("maxlength")
        ? this.translate.instant('reset_password.error.password_min_max')
        : "";
  }
  /**
   * Mensaje de error de código
   */
  getErrorMessageCode() {
    return this.code.hasError("minlength")
      ? this.translate.instant('reset_password.error.code_min_max')
      : this.code.hasError("maxlength")
        ? this.translate.instant('reset_password.error.code_min_max')
        : this.code.hasError("required")
          ? this.translate.instant('reset_password.error.required_value')
          : "";
  }
}
