import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(private http: HttpClient) { }

    /**
   * Obtiene paises
   */
  getCountries():Observable<any>{
    return this.http.get<any>('places_landing/', {observe : 'response'});
  }
}
