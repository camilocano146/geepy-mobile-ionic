import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user/user';
import { UserService } from 'src/app/services/user/user.service';
import sha1 from 'js-sha1'
import {ToastController, PopoverController, NavController, AlertController, ModalController} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { CountriesService } from 'src/app/services/countries/countries.service';
import {ActivatedRoute} from '@angular/router';
import {HelpComponent} from '../../common-components/help/help.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  //---Info basica
  public user: User;
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
  public countries_list: any[];
  public country_selected: FormControl;
  public address_one: FormControl;
  public address_two: FormControl;
  public city: FormControl;
  public state: FormControl;
  public postal_code: FormControl;
  public tributary_register: FormControl;
  public phone: FormControl;
  public type: FormControl;
  public language: string;




  //----Contraseña
  public password: FormControl;
  public hideP: boolean;
  public newPassword: FormControl;
  public hideNP: boolean;
  public confPasword: FormControl;
  public hideCP: boolean;

  constructor(
    private countriesService: CountriesService,
    private loadingService: LoadingService,
    private userService: UserService,
    public toastController: ToastController,
    public popoverController: PopoverController,
    private localStorageService: LocalStorageService,
    private navController: NavController,
    public activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private translate: TranslateService,
    private modalController: ModalController,
  ) {
    this.firstName = new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.lastName = new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
   
    this.type = new FormControl("1", Validators.required);
    this.email = new FormControl("", [Validators.required, Validators.email, Validators.minLength(8), Validators.maxLength(50)]);
    this.password = new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(16)]);
    this.country_selected = new FormControl(null, Validators.required);
    this.tributary_register = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.country_selected = new FormControl(null, Validators.required);
    this.state = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.city = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.address_one = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.address_two = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.phone = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]);
    this.postal_code = new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.language = this.translate.currentLang;



    this.password = new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(16)]);
    this.newPassword = new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(16)]);
    this.confPasword = new FormControl("", Validators.required);
  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.loadingService.presentLoading().then(() => {
      this.userService.obtainUserByToken().subscribe(res => {
        if (res.status == 200) {
          this.user = res.body;
          console.log(this.user);
          this.firstName.setValue(this.user.first_name);
          this.lastName.setValue(this.user.last_name);
          this.email.setValue(this.user.email);
          if (this.user.person_type == '2') {
            this.country_selected.setValue(+this.user.country);
            this.city.setValue(this.user.city);
            this.state.setValue(this.user.state);
            this.address_one.setValue(this.user.addres_one);
            this.address_two.setValue(this.user.addres_two);
            this.phone.setValue(this.user.phone_number);
            this.tributary_register.setValue(this.user.tributary_register);
            this.postal_code.setValue(this.user.postal_code);

          }
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
        }
      }, error => {
        this.loadingService.dismissLoading();
        this.presentToastError(this.translate.instant('profile.error.profile'));
      });
    });
  }

  changeInfo() {
    if (this.type.value == '1') {
      if (this.firstName.valid && this.lastName.valid && this.email.valid) {
        this.loadingService.presentLoading().then(() => {});
        let user: User = new User(this.email.value.toLowerCase(), this.firstName.value, this.lastName.value);

        user.person_type = '1';
        user.postal_code = null;
        user.country = null;
        user.organization = null;
        user.addres_one = null;
        user.addres_two = null;
        user.state = null;
        user.city = null;
        user.phone_number = null;
        user.tributary_register = null;
        this.userService.updateUser(this.user.id, user).subscribe(res => {
          this.presentToastOk(this.translate.instant('profile.info_ok'));
            this.loadingService.dismissLoading().then(() => {
              this.ionViewDidEnter();
            });
        }, err => {
          console.log(err);
          this.loadingService.dismissLoading();
          this.presentToastError(this.translate.instant('register_user.data.error_update'));
        });
      }

    } else if (this.type.value == '2') {
      if (this.firstName.valid &&
        this.lastName.valid &&
        this.email.valid &&
        this.tributary_register.valid &&
        this.country_selected.valid &&
        this.state.valid &&
        this.city.valid &&
        this.postal_code.valid &&
        this.address_one.valid &&
        this.address_two.valid &&
        this.phone.valid) {
        this.loadingService.presentLoading().then(() => {
          let user: User = new User(this.email.value.toLowerCase(), this.firstName.value, this.lastName.value);
          user.person_type = '2';
          user.postal_code = this.postal_code.value;
          user.country = this.country_selected.value;
          user.addres_one = this.address_one.value;
          user.addres_two = this.address_two.value;
          user.state = this.state.value;
          user.city = this.city.value;
          user.phone_number = this.phone.value;
          user.tributary_register = this.tributary_register.value;
  
          this.userService.updateUser(this.user.id, user).subscribe(res => {
            this.presentToastOk(this.translate.instant('profile.info_ok'));
            this.loadingService.dismissLoading().then(() => {
              this.ionViewDidEnter();
            });
          }, err => {
            console.log(err);
            this.loadingService.dismissLoading();
            this.presentToastError(this.translate.instant('register_user.data.error_update'));
          });
        });
        
      }
    }
  }

  changePassword() {
    if (this.password.valid && this.newPassword.valid && this.confPasword.valid && (this.confPasword.value == this.newPassword.value) && this.newPassword.value.length > 5) {
      this.loadingService.presentLoading().then(() => {
        const newPass = {
          password_new: sha1(this.newPassword.value),
          password_old: sha1(this.password.value)
        }
        this.userService.updateUser(this.user.id, newPass).subscribe(res => {
          if (res.status == 200) {
            this.presentToastOk(this.translate.instant('profile.pass_ok'));
            this.password.reset();
            this.newPassword.reset();
            this.confPasword.reset();
            this.loadingService.dismissLoading();
          }
        }, err => {
          this.loadingService.dismissLoading();
          this.presentToastError(this.translate.instant('profile.error.no_update'));
        });
      });
    }
  }


  /**
  * Devuelve el mensaje de password incorrecto
  */
  getErrorMessagePassword() {
    return this.password.hasError("required")
      ? this.translate.instant('profile.error.required_value')
      : this.password.hasError("minlength") || this.password.hasError("maxlength")
        ? this.translate.instant('profile.error.password_min_max')
        : "";
  }
  /**
  * Devuelve el mensaje de password incorrecto
  */
  getErrorMessageNewPassword() {
    return this.newPassword.hasError("required")
      ? this.translate.instant('profile.error.required_value')
      : this.newPassword.hasError("minlength") || this.newPassword.hasError("maxlength")
        ? this.translate.instant('profile.error.password_min_max')
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
      ? this.translate.instant('organizations.manage.create_edit_see.write_value')
      : this.postal_code.hasError("min")
        ? this.translate.instant('organizations.manage.create_edit_see.min_3')
        : this.postal_code.hasError("max")
          ? this.translate.instant('organizations.manage.create_edit_see.max_50')
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
  async settingsPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      mode: 'ios',
    });
    return await popover.present();
  }

  goToHome() {
    this.navController.navigateBack('select-platform');
  }

  async helpDialog($event: MouseEvent) {
    const modal = await this.modalController.create({
      component: HelpComponent
    });
    return await modal.present();
  }
}
