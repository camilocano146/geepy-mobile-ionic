import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Itinerary } from 'src/app/models/itinerary/itinerary';
import {Plan} from '../../models/plan/plan';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {

  constructor(private http: HttpClient) { }

  /**
   * Trae planes por usuario
   */
  getItinerariesIot(): Observable<any>{
    return this.http.get<any>('itineraries_iot/list_by_user/', { observe: 'response'});
  }
  /**
   * Crear un plan
   */
  createPlan(plan: Plan): Observable<any>{
    return this.http.post<any>('itineraries_iot/',plan, { observe: 'response'});
  }
  /**
   * Eliminar plan
   */
  deletePlan(id): Observable<any>{
    return this.http.delete<any>(`itineraries_iot/${id}/`, { observe: 'response'});
  }
  /**
   * Actializar plan
   */
  updatePlan(id, data): Observable<any>{
    return this.http.patch<any>(`itineraries_iot/${id}/`, data,{ observe: 'response'});
  }

  // ----------------- Voyager ------------------

  /**
   * Obtiene paises
   */
  getCountries():Observable<any>{
    return this.http.get<any>('places/', {observe : 'response'});
  }
  /**
   * Obtiene paquete recomendado por ciudad
   */
  getPackageRecommended(country: any):Observable<any>{
    return this.http.post<any>('packages_landing/recommend_packages/',country, {observe: 'response'});
  }
  /**
   * ontine los itinerarios de un usuario
   */
  getItineraries():Observable<any>{
    return this.http.get<any>('itineraries/list_by_user/',{ observe: 'response'});
  }
  /**
   * Crea un itinerario
   */
  createItinerary(itinerary: Itinerary): Observable<any>{
    return this.http.post<any>('itineraries/',itinerary, { observe : 'response' });
  }
  /**
   * Actualizar itinerario
   */
  updateItinerary(id: any, itinerary: Itinerary):Observable<any>{
    return this.http.patch<any>(`itineraries/${id}/`, itinerary, { observe: 'response'});
  }
  /**
   * Cancelar itinerario
   */
  cancelItinerary(id: any):Observable<any>{
    return this.http.delete<any>(`itineraries/${id}/`, {observe: 'response'});
  }
}
