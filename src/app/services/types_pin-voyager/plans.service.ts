import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TypePinVoyager} from '../../models/pin-voyager/PinVoyager';

@Injectable({
  providedIn: 'root'
})
export class TypesPinVoyagerService {

  constructor(private http: HttpClient) { }

  /**
   * Trae los pines
   */
  getAllTypesPinsForPage(page: number, limit: number) {
    return this.http.get<any>(`types_pin/?limit=${limit}&offset=${page}`);
  }

  getTypePinById(id: number) {
    return this.http.get<any>(`types_pin/${id}/`);
  }

  /**
   * Trae los pines
   */
  getAllTypesPins() {
    return this.http.get<any>(`types_pin/`);
  }

  /**
   * Crear pin
   */
  createTypePin(typePinVoyager: TypePinVoyager) {
    return this.http.post<any>('types_pin/', typePinVoyager, { observe: 'response' });
  }
  /**
   * Editar pin
   */
  updateTypePin(id, typePinVoyager: TypePinVoyager) {
    return this.http.patch<any>(`types_pin/${id}/`, typePinVoyager, { observe: 'response' });
  }
  // /**
  //  * Elimina un plan de una organización
  //  */
  // deleteOrganizationPlan(id): Observable<any> {
  //   return this.http.delete<any>(`plans_organization/${id}/`, { observe: 'response' });
  // }
}
