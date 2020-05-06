import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PermissionModuleService {

  constructor(private http: HttpClient) { }

  /**
   * Trae permisos de detalles
   */
  getStatesModuleOrganizationPlatformVector(data):Observable<any>{
    return this.http.post<any>('modules/get_modules_organization/',data,{ observe: 'response' });
  }
}
