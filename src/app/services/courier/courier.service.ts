import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourierService {

  constructor(private http: HttpClient) { }

  /**
 * Trae los couriers de la org
 */
  getCouriersByOrg(id):Observable<any> {
    return this.http.get<any>(`organizations/${id}/couriers/`, { observe: 'response' });
  }
}

