import { Injectable } from '@angular/core';
import { Token } from 'src/app/models/token/token';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user/user';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(private http: HttpClient) { }

  /**
     * Método que obtiene el token almacenado en localstorage
     */
  getStorageToken(): Token {
    let token: Token;
    if (typeof Storage != "undefined") {
      token = JSON.parse(localStorage.getItem("g_c_key"));
    } else {
      token = null;
    }
    return token;
  }

  /**
   * Método para cerrar sesión y eliminar el token
   */
  logOut() {
    let token: Token = this.getStorageToken();
    this.http.get<any>("logout/").subscribe(res => {
    });
    this.removeToken();
    localStorage.clear();
  }

  /**
   * Metodo que remueve el token del localstorage
   */
  removeToken() {
    if (typeof Storage != "undefined") {
      localStorage.removeItem("g_c_key");
    }
  }
  /**
   * Método patra guardar el token de autentcación en locasotrage
   * @param token Token de autenticación
   */
  storageToken(token: Token) {
    this.removeToken();
    let storageWell: boolean = true;
    if (typeof (Storage) !== "undefined") {
      if (token != null) {
        localStorage.setItem("g_c_key", JSON.stringify(token));
      } else {
        storageWell = false;
      }
    } else {
      alert("Update your navigator");
      storageWell = false;
    }
    return storageWell;
  }
/**
   * Método para guardar el usuario en localstorage
   * @param user 
   */
  setStorageUser(user: User) {
    this.removeUser();
    if (typeof (Storage) != "undefined") {
      if (user != null) {
        localStorage.setItem("g_c_user", JSON.stringify(user));
        return true;
      } else {
        localStorage.setItem("g_c_user", null);
        return false;
      }
    } else {
      alert("Update your navigator");
      return false;
    }
  }
  /**
   * Método que almacena el usuario en localstorage
   */
  getStorageUser(): User {
    let user: User;
    if (typeof (Storage) != "undefined") {
      if (localStorage.getItem("g_c_user") != null) {
        user = JSON.parse(localStorage.getItem("g_c_user"));
      }
    } else {
      user = null;
      alert("Update your navigator");
    }
    return user;
  }
  /**
   * Remueve el token de local storage
   */
  removeUser() {
    if (typeof (Storage) != "undefined") {
      localStorage.removeItem("g_c_user");
    }
  }
}
