import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {

  constructor(private http: HttpClient) { }

  /**
   * Trae permisos de detalles
   */
  getStatesModuleOrganizationPlatformVector(data):Observable<any>{
    return this.http.post<any>('modules/get_modules_organization/',data,{ observe: 'response' });
  }
}
