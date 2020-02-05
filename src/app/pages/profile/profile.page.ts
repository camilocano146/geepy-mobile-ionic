import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user/user';
import { UserService } from 'src/app/services/user/user.service';
import sha1 from 'js-sha1'
import { ToastController, PopoverController, NavController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  //---Info basica
  public user: User;
  public name: FormControl;
  public lastname: FormControl;
  public email: FormControl;
  //----Contraseña
  public password: FormControl;
  public hideP: boolean;
  public newPassword: FormControl;
  public hideNP: boolean;
  public confPasword: FormControl;
  public hideCP: boolean;

  constructor(
    private userService: UserService,
    public toastController: ToastController,
    public popoverController: PopoverController,
    private localStorageService: LocalStorageService,
    private navController: NavController,
    private alertController: AlertController,
    private translate: TranslateService) {
    this.name = new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(45)]);
    this.lastname = new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(45)]);
    this.email = new FormControl("", [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(45)]);

    this.password = new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(16)]);
    this.newPassword = new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(16)]);
    this.confPasword = new FormControl("", Validators.required);
  }

  ngOnInit() {
    
  }

  ionViewDidEnter(){
    this.userService.obtainUserByToken().subscribe(res => {
      if (res.status == 200) {
        this.user = res.body;
        this.name.setValue(this.user.first_name);
        this.lastname.setValue(this.user.last_name);
        this.email.setValue(this.user.email);
      }
    }, error => {
      this.presentToastError(this.translate.instant('profile.error.profile'));
    });
  }

  changeInfo() {
    if (this.name.valid && this.lastname.valid && this.email.valid && (this.name.value != this.user.first_name || this.lastname.value != this.user.last_name || this.email.value != this.user.email)) {
      this.user.email = this.email.value.toLowerCase();
      this.user.first_name = this.name.value;
      this.user.last_name = this.lastname.value;
      this.userService.updateUser(this.user.id, this.user).subscribe(res => {
        if(res.status == 200){
          this.presentToastOk(this.translate.instant('profile.info_ok'));
          this.ngOnInit();
        }
      });
    }
  }

  changePassword() {
    if (this.password.valid && this.newPassword.valid && this.confPasword.valid && (this.confPasword.value == this.newPassword.value) && this.newPassword.value.length > 5) {
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
          this.ngOnInit();
        }
      });
    }
  }

  /**
* Devuelve el mensaje de password incorrecto
*/
  getErrorMessageName() {
    return this.name.hasError("required")
      ? this.translate.instant('profile.error.required_value')
      : this.name.hasError("minlength") || this.name.hasError("maxlength")
        ? this.translate.instant('profile.error.name_min_max')
        : "";
  }
  /**
  * Devuelve el mensaje de password incorrecto
  */
  getErrorMessageLastname() {
    return this.lastname.hasError("required")
      ? this.translate.instant('profile.error.required_value')
      : this.lastname.hasError("minlength") || this.lastname.hasError("maxlength")
        ? this.translate.instant('profile.error.lastname_min_max')
        : "";
  }
  /**
  * Devuelve el mensaje de password incorrecto
  */
  getErrorMessageEmail() {
    return this.email.hasError("required")
      ? this.translate.instant('profile.error.required_value')
      : this.email.hasError("email")
      ? this.translate.instant('profile.error.error_email')
      : this.email.hasError("minlength") || this.email.hasError("maxlength")
        ? this.translate.instant('profile.error.email_min_max')
        : "";
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
}
