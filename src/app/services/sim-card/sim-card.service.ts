import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SMS } from 'src/app/models/sms/sms';
import { BuyPackageTop } from 'src/app/models/package/BuyPackageTop';
import { OrderSims } from 'src/app/models/order/order';
import { RepurchasePackage } from 'src/app/models/package/RepurchasePackage';

@Injectable({
  providedIn: 'root'
})
export class SimCardService {

  constructor(private http: HttpClient) { }
  /**
    * Obtener sismcards de un usuario
    */
  getSimCardByUser(id: any): Observable<any> {
    return this.http.get<any>("users/" + id + "/sims/", { observe: 'response' });
  }
  registerSimCardByONUM(onum): Observable<any> {
    return this.http.post<any>("sim_cards_tc/create_tc_by_account/", onum, { observe: 'response' });
  }
  registerSimCardByICCID(iccid): Observable<any> {
    return this.http.post<any>("sim_cards_tc/create_tc_iccid_by_account/", iccid, { observe: 'response' });
  }
  getSimCards(): Observable<any> {
    return this.http.get<any>("sim_cards_tc/", { observe: 'response' });
  }
  getSimCardEndpoint(id): Observable<any> {
    return this.http.get<any>("sim_cards_tc/" + id + "/", { observe: 'response' });
  }

  getSimById(id): Observable<any> {
    return this.http.get<any>("sim_cards_tc/" + id + "/", { observe: 'response' });
  }
  getSimCardById(id): Observable<any> {
    return this.http.get<any>("sim_cards_tc/" + id + "/card_stat/", { observe: 'response' });
  }

  getSimDetails(idSim: number): Observable<any> {
    return this.http.get('sim_cards_tc/' + idSim + '/gbalance/', { observe: 'response' });
  }
  /**
   * Obtener locación
   * @param idSim Id de sim
   */
  getLocation(idSim: number): Observable<any> {
    return this.http.get("sim_cards_tc/" + idSim + "/location/", { observe: 'response' });
  }
  /**
   * Obtiene status de servicio de locacion
   * @param idSim 
   */
  getLocationStatus(idSim: number): Observable<any> {
    return this.http.get("sim_cards_tc/" + idSim + "/location_status/", { observe: 'response' });
  }
  /**
   * Activar servicio de locación
   * @param idSim 
   * @param idPackage
   */
  activateLocationService(idSim: number, idPackage: any) {
    return this.http.post<any>("sim_cards_tc/" + idSim + "/activate_location_app/", idPackage, { observe: 'response' });
  }
  /**
   * Obtener ultima actividad
   * @param idSim Id de sim
   */
  getLastActivity(idSim: number): Observable<any> {
    return this.http.get("sim_cards_tc/" + idSim + "/get_last_activity/", { observe: 'response' });
  }
  /**
   * Conectividad
   * @param idSim 
   */
  getConectivity(idSim: number): Observable<any> {
    return this.http.get("sim_cards_tc/" + idSim + "/netwotk_history/", { observe: 'response' });
  }
  /**
   * Obtener paquete actual
   * @param idSim Id de sim
   */
  getCurrentPackage(idSim: number): Observable<any> {
    return this.http.get("sim_cards_tc/" + idSim + "/get_current_active_packages/", { observe: 'response' });
  }
  /**
   * Bloquear sim
   * @param idSim Id de sim
   */
  blockSimcard(idSim: number): Observable<any> {
    return this.http.post<any>("sim_cards_tc/" + idSim + "/block_sim/", null, { observe: 'response' });
  }
  /**
   * Desbloquear sim
   * @param idSim Id de sim
   */
  unblockSimcard(idSim: number): Observable<any> {
    return this.http.post<any>("sim_cards_tc/" + idSim + "/unblockcard/", null, { observe: 'response' });
  }
  sendSMS1(idSim: number, sms: SMS): Observable<any> {
    return this.http.post<any>("sim_cards_tc/" + idSim + "/send_sms_app/", sms, { observe: 'response' });
  }

  getAvaiablePackages(idSim: number): Observable<any> {
    return this.http.get<any>("sim_cards_tc/" + idSim + "/getserviceoptions/", { observe: 'response' });
  }

  addPackageToSim(idSim: number, packageToBuy: BuyPackageTop) {
    return this.http.post<any>("sim_cards_tc/" + idSim + "/manage_services_avalaibles_app/", packageToBuy, { observe: 'response' });
  }
  /**
   * Historico de paquetes
   */
  getHistoryPackageOfSimcard(idSim: number): Observable<any> {
    return this.http.get<any>("sim_cards_tc/" + idSim + "/get_history_packages/", { observe: 'response' });
  }
  /**
   * Actualiza endpoint
   */
  updateEndpoint(idSim: number, endpoint: any): Observable<any> {
    return this.http.patch<any>("sim_cards_tc/" + idSim + "/", endpoint, { observe: 'response' });
  }
  /**
   * Agregar nuevo número
   */
  addNumber(idSim: number, enumNew: any): Observable<any> {
    return this.http.post<any>("sim_cards_tc/" + idSim + "/add_extra_number_SIM/", enumNew, { observe: 'response' });
  }

  getExtranumber(idSim: number): Observable<any> {
    return this.http.get<any>("sim_cards_tc/" + idSim + "/list_extra_number_SIM/", { observe: 'response' });
  }
  /**
   * Eliminar numero
   */
  deleteNumber(idSim: number, enumNew: any): Observable<any> {
    return this.http.post<any>("sim_cards_tc/" + idSim + "/remove_extra_number_SIM/", enumNew, { observe: 'response' });
  }
  /**
   * Agregar saldo a sim
   */
  addBalanceToSim(idSim: number, amount: any): Observable<any> {
    return this.http.post<any>("sim_cards_tc/" + idSim + "/add_credit_SIM/", amount, { observe: 'response' });
  }
  /**
   * Elimianr sim
   */
  deleteSimCard(idSim: number): Observable<any> {
    return this.http.post<any>("sim_cards_tc/" + idSim + "/delete_sim/", null, { observe: 'response' });
  }
  /**
   * Obteiene la data para exportar
   */
  getSimsToExport(): Observable<any> {
    return this.http.get<any>('sim_cards_tc/report_excel/', { observe: 'response' });
  }
  /**
   * obtiene los sms
   */
  getSMSofSim(idSim: number): Observable<any> {
    return this.http.get<any>(`sim_cards_tc/${idSim}/view_sms/`, { observe: 'response' });
  }
/**
   * Reconecta la sim
   */
  reconnectSim(idSim: number): Observable<any> {
    return this.http.post<any>("sim_cards_tc/" + idSim + "/reconnect_SIMcard_Mobile_Network/", null, { observe: 'response' });
  }
  /**
   * Obtiene historico de paquetes
   */
  getPacakgeHistoryApp(idSim: any): Observable<any> {
    return this.http.post<any>("sim_cards_tc_has_package/list_history_packages/", idSim, { observe: 'response' });
  }
  /**
   * Obtiene lista de paquetes de sims para comprar
   */
  getSimsPackages(){
    return this.http.get<any>(`sets_sim_card_voyager/`, { observe: 'response' });
  }

  /**
   * Comprar sims
   */
  orderSims(order: OrderSims): Observable<any> {
    return this.http.post<any>("sets_sim_card_voyager/order_sim/", order, { observe: 'response' });
  }
  /**
   * Reactivar un paquete
   */
  repurchasePackage(data: RepurchasePackage): Observable<any> {
    return this.http.post<any>('sim_cards_tc/reactivate_services_avalaibles_app/',data,{ observe: 'response' });
  }
  /**
   * Obtiene los paquetes de mayor valor
   */
  searchBestPackages(data: RepurchasePackage): Observable<any> {
    return this.http.post<any>('sim_cards_tc/upgrade_services_avalaibles_app/',data,{ observe: 'response' });
  }
  /**
   * Trae permiso de detalles
   */
  getStatesModuleOrganizationPlatform(code): Observable<any>{
    return this.http.get<any>(`modules/${code}/get_module_organization/`,{ observe: 'response' });
  }
}
