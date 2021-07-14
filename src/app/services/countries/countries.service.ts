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


  getCountriesPaginate(regex: string, offset: number, limit: number,){
    let textFilter = '';
    if (regex) {
      textFilter = `&regex=${regex}`;
    }
    return this.http.get<any>(`places_landing/list_places_paginate/?offset=${offset}&limit=${limit}${textFilter}`, {observe : 'response'});
  }
}
