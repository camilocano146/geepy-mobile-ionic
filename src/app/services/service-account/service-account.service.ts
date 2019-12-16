import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceAccountService {

  constructor(private http:HttpClient) { }

  getServicesAccounts() {
    return this.http.get<any>("account_tc/", { observe: "response" });
  }
}
