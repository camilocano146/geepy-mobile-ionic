import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceAccountIridiumService {

  constructor(private http: HttpClient) { }

  /**
   * trae cuentas de servicio
   */
  getServiceAccountIridium(){
    return this.http.get<any>('accounts_iridium/' , { observe : 'response'});
  }
}
