import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from 'src/app/models/global/global';
import { DeviceImportImei } from 'src/app/models/device/device-import-imei';
import { Destinatary } from 'src/app/models/destinatary/destinatary';
import { OrderDevice } from 'src/app/models/order/order-iridium';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient) { }
  /**
   * Obtener devices
   */
  getDevices(id: any, offset?: number, limit?: number, text?: string):Observable<any>{
    let textFilter = '';
    if (text) {
      textFilter = `&regex=${text}`;
    }
    return this.http.get<any>(`users/${id}/modems/?offset=${offset}&limit=${limit}${textFilter}`,{ observe : 'response'});
  }
  /**
   * Detalles de 1 device
   */
  getDeviceById(id): Observable<any>{
    return this.http.get<any>(`modems/${id}/contracts/`,{ observe : 'response'});
  }

  /**
   * Trae cntratos de 1 device
   */
  getDeviceContracts(id): Observable<any>{
    return this.http.get<any>(`modems/${id}/get_contracts/`,{ observe : 'response'});
  }
  /**
   * Get usage
   */
  getUsage(id, data):Observable<any>{
    return this.http.post<any>(`modems/${id}/get_usage/`,data,{ observe : 'response'});
  }
    /**
   * Get usage sumary
   */
  getUsageSumary(id, data):Observable<any>{
    return this.http.post<any>(`modems/${id}/get_usage_summary/`,data,{ observe : 'response'});
  }
  /**
   * Obtener ultimo suscriptor
   */
  getLastSuscriber(id){
    return this.http.get<any>(`modems/${id}/subscriber/`,{ observe : 'response'});
  }
  /**
   * activar
   */
  activate(id, data){
    return this.http.post<any>(`modems/${id}/activate/`,data,{ observe : 'response'});
  }
    /**
   * Desactivar
   */
  desactivate(id, data){
    return this.http.post<any>(`modems/${id}/deactivate/`,data,{ observe : 'response'});
  }
  /**
   * suspender
   */
  suspend(id, data){
    return this.http.post<any>(`modems/${id}/suspend/`,data,{ observe : 'response'});
  }
      /**
   * resumir
   */
  resume(id){
    return this.http.post<any>(`modems/${id}/resume/`,null,{ observe : 'response'});
  }

  resumeSuscription(id,data){
    return this.http.post<any>(`modems/${id}/resumeSuscribtion/`,data,{ observe : 'response'});
  }
  /**
   * Obtener planes
   */
  getPlans(){
    return this.http.get<any>(`organizations/${Global.organization_id}/plans/`,{ observe : 'response'});
  }

  /**
   * Importar 
   */
  importImei(deviceImportImei: DeviceImportImei){
    return this.http.post<any>('modems/import_subscriber_imei/', deviceImportImei, { observe: 'response'});
  }

  addDestinatary(destnatary: Destinatary): Observable<any>{
    return this.http.post<any>('destinations/',destnatary, {observe: 'response'});
  }
  /**
   * Eliminar destinatart
   */
  deleteDestinatary(id): Observable<any>{
    return this.http.delete<any>(`destinations/${id}/`, {observe: 'response'});
  }

  getDestinationsByModem(id):Observable<any>{
    return this.http.get<any>(`modems/${id}/destinations/`,{observe: 'response'});
  }

  getDevicesPackages(){
    return this.http.get<any>('devices_iridium/', {observe: 'response'});
  }

  orderDevice(orderDevice: OrderDevice){
    return this.http.post<any>('devices_iridium/order_device/', orderDevice, { observe: 'response'});
  }

  getCompatibleDevicesDevicesCompatible(body: {ostype: string}) {
    return this.http.post<any>('devices_compatible/', body, { observe: 'response'});
  }

  getCompatibleDevicesOsType() {
    return this.http.get<any>(`os_type/`, { observe: 'response'});
  }
}
