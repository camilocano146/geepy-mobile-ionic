import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, Form } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { ResetPassword } from 'src/app/models/reset-password/reset-password';
import sha1 from 'js-sha1'
import { User } from 'src/app/models/user/user';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { CountriesService } from 'src/app/services/countries/countries.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  /**
   * Nombre
   */
  public firstName: FormControl;
  /**
   * Apellisdos
   */
  public lastName: FormControl;
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

  public type: FormControl;
  public referer: FormControl;

  public countries_list: any[];
  public country_selected: FormControl;
  public address_one: FormControl;
  public address_two: FormControl;
  public city: FormControl;
  public state: FormControl;
  public postal_code: FormControl;
  public tributary_register: FormControl;
  public phone: FormControl;

  public language: string;

  constructor(
    private countriesService: CountriesService,
    private loadingService: LoadingService,
    public navCotroller: NavController,
    private authenticationService: AuthenticationService,
    public toastController: ToastController,
    private translate: TranslateService
  ) {
    this.hide = true;
    this.Chide = true;
    this.countries_list = [];
    this.password = new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
    this.confirmPassword = new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
    this.firstName = new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.lastName = new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.referer = new FormControl("", [Validators.minLength(1), Validators.maxLength(16)]);
    this.type = new FormControl("1", Validators.required);
    this.email = new FormControl("", [Validators.required, Validators.email, Validators.minLength(8), Validators.maxLength(50)]);
    // this.password = new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(16)]);
    this.country_selected = new FormControl(null, Validators.required);
    this.tributary_register = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.country_selected = new FormControl(null, Validators.required);
    this.state = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.city = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.address_one = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.address_two = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.phone = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]);
    this.postal_code = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.language = this.translate.currentLang;
  }

  ngOnInit() {
    this.loadingService.presentLoading().then(() => {
      this.countriesService.getCountries().subscribe(res => {
        if (res.status == 200) {
          this.countries_list = res.body;
          if (this.language == 'es') {
            this.countries_list.sort((a, b) => a.nombre.localeCompare(b.nombre));
          } else {
            this.countries_list.sort((a, b) => a.name.localeCompare(b.name));
          }
          this.loadingService.dismissLoading();
        }
      }, err => {
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('register_user.data.error_country'));
        console.log(err);
      });
    });

  }

  create() {
    if (this.type.value == '1') {
      if (this.firstName.valid &&
        this.lastName.valid &&
        this.email.valid &&
        this.password.valid &&
        this.confirmPassword.valid &&
        this.password.value == this.confirmPassword.value) {
        this.loadingService.presentLoading().then(() => {
          let email: string = this.email.value.trim().toLowerCase();
          let user: User = new User(email.toLowerCase(), this.firstName.value.toLowerCase(), this.lastName.value.toLowerCase());
          user.password = sha1(this.password.value);
          user.role = 5;
          user.is_lock = false;
          user.person_type = "1";
          if (this.referer.value != null) {
            if (this.referer.value != '' && this.referer.valid) {
              user.referrer = this.referer.value;
            }
          }
          this.authenticationService.createUserWithOutToken(user).subscribe(res => {
            if (res.status == 201) {
              this.presentToastOk(this.translate.instant('register_user.data.create_ok'));
              this.loadingService.dismissLoading().then(() => {
                this.navCotroller.navigateRoot("login");
              });
            }
          }, err => {
            console.log(err);
            this.loadingService.dismissLoading();
            if (err.status == 400 || err.status == 422) {
              if (err.error.email) {
                if (err.status == 400 && err.error.email[0] == "Introduzca una dirección de correo electrónico válida.") {
                  this.presentToastError(this.translate.instant('register_user.data.error_mail_use'));
                } else if (err.status == 400 && err.error.email[0] == "Este campo debe ser único.") {
                  this.presentToastError(this.translate.instant('register_user.data.error_mail'));
                }
              }
              if (err.error.detail) {
                if (err.status == 422 && err.error.detail == "Error to send email") {
                  this.presentToastError(this.translate.instant('register_user.data.error_mail'));
                }
              }
              if (err.error.error) {
                this.presentToastError(this.translate.instant('register_user.data.error_referer'));
              }

            } else if (err.status == 500) {
              this.presentToastError(this.translate.instant('register_user.data.error_server'));
            } else {
              this.presentToastError(this.translate.instant('register_user.data.create_error'));
            }
          });
        });
      } else {
        this.firstName.markAsTouched();
        this.lastName.markAsTouched();
        this.email.markAsTouched();
        this.password.markAsTouched();
        this.confirmPassword.markAsTouched();
      }
    } else if (this.type.value == '2') {
      if (this.firstName.valid &&
        this.lastName.valid &&
        this.email.valid &&
        this.password.valid &&
        this.tributary_register.valid &&
        this.country_selected.valid &&
        this.state.valid &&
        this.city.valid &&
        this.postal_code.valid &&
        this.address_one.valid &&
        this.address_two.valid &&
        this.phone.valid &&
        this.confirmPassword.valid &&
        this.password.value == this.confirmPassword.value) {
        this.loadingService.presentLoading().then(() => {
          let email: string = this.email.value.trim().toLowerCase();
          let user: User = new User(email.toLowerCase(), this.firstName.value.toLowerCase(), this.lastName.value.toLowerCase());
          user.password = sha1(this.password.value);
          user.role = 5;
          user.is_lock = false;
          user.postal_code = this.postal_code.value;
          user.country = this.country_selected.value;
          user.addres_one = this.address_one.value;
          user.addres_two = this.address_two.value;
          user.state = this.state.value;
          user.city = this.city.value;
          user.phone_number = this.phone.value;
          user.tributary_register = this.tributary_register.value;
          if (this.referer.value != null) {
            if (this.referer.value != '' && this.referer.valid) {
              user.referrer = this.referer.value;
            }
          }
          user.person_type = "2";
          console.log(user);
          this.authenticationService.createUserWithOutToken(user).subscribe(res => {
            if (res.status == 201) {
              this.presentToastOk(this.translate.instant('register_user.data.create_ok'));
              this.loadingService.dismissLoading().then(() => {
                this.navCotroller.navigateRoot("login");
              });
            }
          }, err => {
            console.log(err);
            this.loadingService.dismissLoading();
            if (err.status == 400 || err.status == 422) {
              if (err.error.email) {
                if (err.status == 400 && err.error.email[0] == "Introduzca una dirección de correo electrónico válida.") {
                  this.presentToastError(this.translate.instant('register_user.data.error_mail_use'));
                } else if (err.status == 400 && err.error.email[0] == "Este campo debe ser único.") {
                  this.presentToastError(this.translate.instant('register_user.data.error_mail'));
                }
              }
              if (err.error.detail) {
                if (err.status == 422 && err.error.detail == "Error to send email") {
                  this.presentToastError(this.translate.instant('register_user.data.error_mail'));
                }
              }
              if (err.error.error) {
                this.presentToastError(this.translate.instant('register_user.data.error_referer'));
              }
            } else if (err.status == 500) {
              this.presentToastError(this.translate.instant('register_user.data.error_server'));
            } else {
              this.presentToastError(this.translate.instant('register_user.data.create_error'));
            }
          });
        });
      } else {
        this.firstName.markAsTouched();
        this.lastName.markAsTouched();
        this.email.markAsTouched();
        this.password.markAsTouched();
        this.tributary_register.markAsTouched();
        this.country_selected.markAsTouched();
        this.state.markAsTouched();
        this.city.markAsTouched();
        this.postal_code.markAsTouched();
        this.address_one.markAsTouched();
        this.address_two.markAsTouched();
        this.phone.markAsTouched();
        this.confirmPassword.markAsTouched();
      }
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
      ? this.translate.instant('register_user.error.required_value')
      : this.password.hasError("minlength") || this.password.hasError("maxlength")
        ? this.translate.instant('register_user.error.password_min_max')
        : "";
  }
  /**
   * Devuelve el mensaje de confimar password incorrecto
   */
  getErrorMessageConfirmPassword() {
    return this.confirmPassword.hasError("required")
      ? this.translate.instant('register_user.error.required_value')
      : this.confirmPassword.hasError("minlength") || this.confirmPassword.hasError("maxlength")
        ? this.translate.instant('register_user.error.password_min_max')
        : "";
  }
  /**
    * Mensaje de error nombre
    */
  getErrorMessageName() {
    return this.firstName.hasError("required")
      ? this.translate.instant('register_user.data.required_value')
      : this.firstName.hasError("pattern")
        ? this.translate.instant('register_user.data.only_letters')
        : this.firstName.hasError("minlength")
          ? this.translate.instant('register_user.data.min_3')
          : this.firstName.hasError("maxlength")
            ? this.translate.instant('register_user.data.max_50')
            : "";
  }
  /**
   * Mensaje de error apellidos
   */
  getErrorMessageLastName() {
    return this.lastName.hasError("required")
      ? this.translate.instant('register_user.data.required_value')
      : this.lastName.hasError("pattern")
        ? this.translate.instant('register_user.data.only_letters')
        : this.lastName.hasError("minlength")
          ? this.translate.instant('register_user.data.min_3')
          : this.lastName.hasError("maxlength")
            ? this.translate.instant('register_user.data.max_50')
            : "";
  }
  /**
   * Mensaje de error apellidos
   */
  getErrorMessageEmail() {
    return this.email.hasError("required")
      ? this.translate.instant('register_user.data.required_value')
      : this.email.hasError("email")
        ? this.translate.instant('register_user.data.error_email')
        : this.email.hasError("minlength")
          ? this.translate.instant('register_user.data.min_5')
          : this.email.hasError("maxlength")
            ? this.translate.instant('register_user.data.max_50')
            : "";
  }

  /**
  * Mensaje de error password
  */
  getErrorMessageReferrer() {
    return this.referer.hasError("minlength")
      ? this.translate.instant('register_user.data.min_8')
      : this.referer.hasError("maxlength")
        ? this.translate.instant('register_user.data.max_16')
        : "";
  }

  getErrorMessageCountry() {
    return this.country_selected.hasError("required")
      ? this.translate.instant('register_user.data.select_value')
      : "";
  }

  getErrorMessageCity() {
    return this.city.hasError("required")
      ? this.translate.instant('register_user.data.write_value')
      : this.city.hasError("minlength")
        ? this.translate.instant('register_user.data.min_3')
        : this.city.hasError("maxlength")
          ? this.translate.instant('register_user.data.max_50')
          : "";
  }

  getErrorMessageAddressOne() {
    return this.address_one.hasError("required")
      ? this.translate.instant('register_user.data.write_value')
      : this.address_one.hasError("minlength")
        ? this.translate.instant('register_user.data.min_3')
        : this.address_one.hasError("maxlength")
          ? this.translate.instant('register_user.data.max_25')
          : "";
  }

  getErrorMessageAddressTwo() {
    return this.address_two.hasError("required")
      ? this.translate.instant('register_user.data.write_value')
      : this.address_two.hasError("minlength")
        ? this.translate.instant('register_user.data.min_3')
        : this.address_two.hasError("maxlength")
          ? this.translate.instant('register_user.data.max_25')
          : "";
  }

  getErrorMessageState() {
    return this.state.hasError("required")
      ? this.translate.instant('register_user.data.write_value')
      : this.state.hasError("minlength")
        ? this.translate.instant('register_user.data.min_3')
        : this.state.hasError("maxlength")
          ? this.translate.instant('register_user.data.max_50')
          : "";
  }

  getErrorMessageNumber() {
    return this.tributary_register.hasError("required")
      ? this.translate.instant('register_user.data.write_value')
      : this.tributary_register.hasError("minlength")
        ? this.translate.instant('register_user.data.min_3')
        : this.tributary_register.hasError("maxlength")
          ? this.translate.instant('register_user.data.max_50')
          : "";
  }


  getErrorMessagePhone() {
    return this.phone.hasError("required")
      ? this.translate.instant('register_user.data.write_value')
      : this.phone.hasError("minlength")
        ? this.translate.instant('register_user.data.min_8')
        : this.phone.hasError("maxlength")
          ? this.translate.instant('register_user.data.max_16')
          : "";
  }
  getErrorMessageCode() {
    return this.postal_code.hasError("required")
      ? this.translate.instant('register_user.data.write_value')
      : this.postal_code.hasError("minlength")
        ? this.translate.instant('register_user.data.min_3')
        : this.postal_code.hasError("maxlength")
          ? this.translate.instant('register_user.data.max_50')
          : "";
  }
}
