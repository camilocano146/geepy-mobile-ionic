import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user/user';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { Token } from 'src/app/models/token/token';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private localStorageService: LocalStorageService,
    private http: HttpClient,) { }

  /**
   * Método para crear usuario
   */
  createUser(user: User) {
    return this.http.post<any>("users/", user, { observe: 'response' });
  }
  /**
   * Obtener usuario por ID
   */
  obtainUserById(idUser: number) {
    return this.http.get<any>("users/" + idUser + "/", { observe: 'response' });
  }
  obtainUserByToken() {
    let token: Token = this.localStorageService.getStorageToken();
    return this.http.get<any>("profile/" + token.access_token + "/", { observe: 'response' });
  }
  updateUserByToken(info: any) {
    let token: Token = this.localStorageService.getStorageToken();
    return this.http.patch<any>("profile/" + token.access_token + "/", info, { observe: 'response' });
  }
    /**
   * Actualizar usuario
   * @param idUser 
   * @param user 
   */
  updateUser(idUser: number, user: any) {
    return this.http.patch<any>("users/" + idUser + "/", user, { observe: 'response' });
  }
}
