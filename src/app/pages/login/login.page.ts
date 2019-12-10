import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';

import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Credential } from '../../models/credential/credential';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { Token } from 'src/app/models/token/token';
import sha1 from 'js-sha1'
import { TranslateService } from '@ngx-translate/core';
import { ToastController, NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user/user';

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

  public l: any;

  constructor(
    private authenticationService: AuthenticationService,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    public toastController: ToastController,
    public navCotroller: NavController,
    private userService: UserService
  ) {
    this.hide = true;
    this.preloadSignIn = false;
  }

  ngOnInit() {
    this.existUser = true;
    this.email = new FormControl("", [Validators.required, Validators.email]);
    this.password = new FormControl("", [Validators.required]);
    
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
            console.log(this.localStorageService.getStorageToken());
            this.userService.obtainUserByToken().subscribe(res => {
              let u = res.body;
              let user: User = new User(u.email, u.first_name, u.last_name);
              user.id = u.id;
              user.is_lock = u.is_lock;
              console.log(user);
              this.localStorageService.setStorageUser(user);
              if (user.is_lock) {
                this.existUser = true;
                this.presentToastWarning("translate.instant('login.sign-in.is-blocked')");
              } else {
                this.navCotroller.navigateRoot('home');
              }
            });
          }
        }, err => {
          console.log(err);
          if (err.status == 403) {
            this.presentToastError('login.sign-in.is-blocked')
          } else if (err.status == 400) {
            this.presentToastError('login.sign-in.error-user-wrong-credentials');
          } else if (err.status == 401 && err.error.error == "user don't found") {
            this.presentToastError('login.sign-in.error-user-not-found');
          } else if (err.status == 500) {
            this.presentToastError('Server error');
          } else if (err.status == 401 && err.error.error == "unverify email") {
            this.presentToastWarning("Cuenta deasctivada.")
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
          ? this.translate.instant('login.sign-in.required-value')
          : this.email.hasError("email")
            ? this.translate.instant('login.sign-in.error-email')
            : "";
      }

  /**
   * Devuelve el mensaje de password incorrecto
   */
  getErrorMessagePassword() {
        return this.password.hasError("required")
          ? this.translate.instant('login.sign-in.required-value')
          : this.password.hasError("pattern")
            ? this.translate.instant('login.sign-in.error-password')
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
