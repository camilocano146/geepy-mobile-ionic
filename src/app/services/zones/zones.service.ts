import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZonesService {

  constructor(private http: HttpClient) { }

  /**
   * Obtiene las zonas iot
   */
  getZonesIot(): Observable<any>{
    return this.http.get<any>('iot_zones/', { observe: 'response'});
  }
  /**
   * Obtiene las zonas
   */
  getZones(): Observable<any>{
    return this.http.get<any>('zones/', { observe: 'response'});
  }

  getZonesWithoutCountries(): Observable<any>{
    return this.http.get<any>('zones/list_zones/', { observe: 'response'});
  }
  /**
   * Paises
   */
  getCountries(): Observable<any>{
    return this.http.get<any>('places/', { observe: 'response'});
  }
  /**
   * Get countries availables
   */
  getAvailableCountiresToPurchase():Observable<any>{
    return this.http.get<any>('sets_sim_card_voyager/list_avalaibles_places/', { observe: 'response'});
    
  }
}
