import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {Global} from '../../models/global/global';

@Injectable({
  providedIn: 'root'
})
export class ServiceAccountService {

  constructor(private http: HttpClient) { }

  getServicesAccountsIotM2MConnect() {
    return this.http.get<any>("emnify_accounts/", { observe: "response" });
  }

  getServicesAccounts() {
    return this.http.get<any>("account_tc/", { observe: "response" });
  }

  /**
   * Obtiene las cuentas de servicio de la organización
   */
  getServiceAccountByOrg(): Observable<any>{
    return this.http.get<any>("organizations/"+Global.organization_id+"/accounts_iot/", {observe: 'response'});
  }
}
