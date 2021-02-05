import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecommendService {

  constructor(private http: HttpClient) { }

  sendRecomendation(email: any){
    return this.http.post<any>('users/recomendate/',email,{observe: 'response'});
  }
}
