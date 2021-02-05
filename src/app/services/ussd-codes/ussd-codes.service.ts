import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UssdCodesService {

  constructor(private http: HttpClient) { }

  getUSSDCOdes(): Observable<any>{
    return this.http.get<any>('ussd/' ,{observe: 'response'});
  }
}