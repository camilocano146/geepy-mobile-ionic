import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token } from 'src/app/models/token/token';
import { ActivationCode } from 'src/app/models/activation-code/activation-code';
import { ResetPassword } from 'src/app/models/reset-password/reset-password';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { User } from 'src/app/models/user/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

  login(credencial): Observable<any> {
    this.localStorageService.removeToken();
    return this.http.post<any>("login/", credencial, { observe: 'response' });
  }
   /**
   * Envia codigo de recuperación al correo
   * @param email Email de la cuenta a recuperar
   */
  sendEmailrecoveryPassword(email): Observable<any> {
    return this.http.post<any>("user/restore_password/", email);
  }
  /**
   * Método que envia codigo de activación de cuenta al correo
   * @param email Email de la cuenta a activar
   */
  sendActivationCode(code: ActivationCode): Observable<any> {
    return this.http.post<any>("user/verify_email/", code);
  }
  /**
   * Métpdo para enviar cambiar la contraseña del usuario
   * @param password 
   * @param user 
   */
  resetPassword(resetPassword: ResetPassword): Observable<any> {
    return this.http.post("user/new_password/", resetPassword);
  }
  /**
   * Crea un usuario sin toekn
   */
  createUserWithOutToken(user: User):Observable<any>{
    return this.http.post<any>('user/register/', user, { observe: 'response'});
  }
  /**
   * Enviar firebae token
   */
  sendNotificationsToken(token: any):Observable<any>{
    return this.http.post<any>("devices_token/update_token/" ,token ,{ observe: 'response' });
  }

}
