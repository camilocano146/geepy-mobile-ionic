import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, Form } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { ResetPassword } from 'src/app/models/reset-password/reset-password';
import sha1 from 'js-sha1'
import { User } from 'src/app/models/user/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  /**
   * Nombre
   */
  public name: FormControl;
  /**
   * Apellisdos
   */
  public lastname: FormControl;
  /**
   * Email
   */
  public email: FormControl;
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
    this.name = new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.lastname = new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
  }

  ngOnInit() {

  }

  create() {
    if (
      this.name.valid &&
      this.lastname.valid &&
      this.email.valid &&
      this.password.valid &&
      this.confirmPassword.valid &&
      this.password.value == this.confirmPassword.value
    ) {
      let user: User = new User(this.email.value,this.name.value,this.lastname.value);
      user.password = sha1(this.password.value);
      user.role = 5;
      this.authenticationService.createUserWithOutToken(user).subscribe(res => {
        console.log(res);
        if(res.status == 201){
          this.presentToastOk("User created successfully!");
          this.navCotroller.navigateRoot("");
        }
      },err => {
        if (err.status == 400) {
          this.presentToastError("Email alrealdy in use.");
        } else if (err.status == 422 && err.error.detail == "Error to send email"){
          this.presentToastError("Error in Mail service. Please contact with administrator site.");
        } else if (err.status == 500){
          this.presentToastError("Server error. Please contact with administrator site.");
        } else {
          this.presentToastError("We couldn't create new user.");
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
  getErrorMessageName() {
    return this.name.hasError("minlength")
      ? this.translate.instant('validations.error-8-characteres')
      : this.name.hasError("maxlength")
        ? this.translate.instant('validations.error-8-characteres')
        : this.name.hasError("required")
          ? this.translate.instant('validations.required-value')
          : "";
  }
  getErrorMessageLastname() {
    return this.lastname.hasError("minlength")
      ? this.translate.instant('validations.error-8-characteres')
      : this.lastname.hasError("maxlength")
        ? this.translate.instant('validations.error-8-characteres')
        : this.lastname.hasError("required")
          ? this.translate.instant('validations.required-value')
          : "";
  }
  getErrorMessageEmail() {
    return this.lastname.hasError("email")
      ? this.translate.instant('validations.error-8-characteres')
        : this.lastname.hasError("required")
          ? this.translate.instant('validations.required-value')
          : "";
  }
}
