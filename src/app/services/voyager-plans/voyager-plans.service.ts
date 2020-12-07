import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VoyagerPlansService {

  constructor(private http: HttpClient) { }

  getPricingEsimsByOrganization(idOrganization: number) {
    return this.http.get<any>(`organizations/${idOrganization}/esim_rates/?limit=10&offset=0`, { observe: 'response' });
  }
}
