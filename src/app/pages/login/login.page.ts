import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Credential } from '../../models/credential/credential';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { Token } from 'src/app/models/token/token';
import sha1 from 'js-sha1'
import { TranslateService } from '@ngx-translate/core';
import { ToastController, NavController, Platform } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user/user';
import { FCM } from '@ionic-native/fcm/ngx';
import { NotificationToken } from 'src/app/models/token/notification-token';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  /**
   * Campo de ocultar contraseña 
  */
  public hide: boolean;
  /**
   * Preload de sign in
   */
  public preloadSignIn: boolean;
  /**
   * Campo para activar si existe error en la petición
   */
  public existUser: boolean;
  /**
   * Mensaje de error
   */
  public errorMessage: string;
  /**
   *  Validador del email
   */
  public email: FormControl;

  /**
   * Validador de la contraseña
   */
  public password: FormControl;

  public login: any;

  constructor(
    private authenticationService: AuthenticationService,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    public toastController: ToastController,
    public navCotroller: NavController,
    private userService: UserService,
    private fcm: FCM,
    public plt: Platform
  ) {
    this.hide = true;
    this.preloadSignIn = false;
    this.existUser = true;
    this.email = new FormControl("", [Validators.required, Validators.email]);
    this.password = new FormControl("", [Validators.required]);
  }
  ngOnInit(): void {
    console.log(this.translate.currentLang);
  }
  /**
   * Método de inicio de sesión
   */
  signIn() {
    if (this.email.valid && this.password.valid) {
      this.preloadSignIn = true;
      this.existUser = true;
      let credential: Credential = new Credential(
        this.email.value.toLowerCase(),
        sha1(this.password.value)
      );
      this.authenticationService.login(credential).subscribe(
        res => {
          if (res.status == 200) {
            let token: Token = (res.body);
            this.localStorageService.storageToken(token);
            //--------------Tokenn de Firebase
            this.fcm.getToken().then(token => {
              let notificationToken: NotificationToken = new NotificationToken(this.translate.currentLang, token);
              if (this.plt.is('ios')) {
                notificationToken.platform = "ios";
              } else if (this.plt.is('android')) {
                notificationToken.platform = "android";
              }
              console.log(notificationToken);
              this.authenticationService.sendNotificationsToken(notificationToken).subscribe(res => {
              }, err => {
                this.presentToastError(this.translate.instant('notification_token'));
                this.navCotroller.navigateRoot('');
              });
            });
            //-----------------------------------------
            this.userService.obtainUserByToken().subscribe(res => {
              let u = res.body;
              let user: User = new User(u.email, u.first_name, u.last_name);
              user.id = u.id;
              user.is_lock = u.is_lock;
              this.localStorageService.setStorageUser(user);
              if (user.is_lock) {
                this.presentToastError("translate.instant('login.error.is-blocked')");
              } else {
                this.navCotroller.navigateRoot('home');
              }
            });
          }
        }, err => {
          if (err.status == 403) {
            this.presentToastError(this.translate.instant('login.error.is-blocked'))
          } else if (err.status == 400) {
            this.presentToastError(this.translate.instant('login.error.error-user-wrong-credentials'));
          } else if (err.status == 401 && err.error.error == "user don't found") {
            this.presentToastError(this.translate.instant('login.error.error-user-not-found'));
          } else if (err.status == 500) {
            this.presentToastError(this.translate.instant('login.error.server_error'));
          } else if (err.status == 401 && err.error.error == "unverify email") {
            this.presentToastWarning(this.translate.instant('login.error.account-disabled'))
            this.navCotroller.navigateRoot(["activate-account"]);
          }
        });
    }
  }

  /**
   * Devuelve el mensaje de email incorrecto
   */
  getErrorMessageEmail() {
    return this.email.hasError("required")
      ? this.translate.instant('login.error.required_value')
      : this.email.hasError("email")
        ? this.translate.instant('login.error.error_email')
        : "";
  }

  /**
   * Devuelve el mensaje de password incorrecto
   */
  getErrorMessagePassword() {
    return this.password.hasError("required")
      ? this.translate.instant('login.error.required_value')
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
  async presentToastWarning(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 3000,
      color: 'warning'
    });
    toast.present();
  }
}