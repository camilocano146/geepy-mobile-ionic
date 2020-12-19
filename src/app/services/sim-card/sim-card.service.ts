import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SMS } from 'src/app/models/sms/sms';
import { BuyPackageTop } from 'src/app/models/package/BuyPackageTop';
import {OrderSims, OrderSimsVoyager} from 'src/app/models/order/order';
import { RepurchasePackage } from 'src/app/models/package/RepurchasePackage';
import {EventSimCard} from '../../models/sim-card/event';
import {Bic} from '../../models/sim-card/bic';

@Injectable({
  providedIn: 'root'
})
export class SimCardService {
  // tslint:disable-next-line:variable-name
  private _lastESimsPurchased: string[];

  constructor(private http: HttpClient) { }

  get lastESimsPurchased(): string[] {
    return this._lastESimsPurchased;
  }

  set lastESimsPurchased(value: string[]) {
    this._lastESimsPurchased = value;
  }

  /**
   * Obtener sismcards iot de solo este usuario
   */
  getSimCardIotWithoutReferrals(id: any, offset: number, limit: number, text?: string) {
    let textFilter = '';
    if (text) {
      textFilter = `&regex=${text}`;
    }
    return this.http.get<any>(`users/${id}/my_sims_iot/?offset=${offset}&limit=${limit}${textFilter}`, {observe: 'response'});
  }

  /**
   * Obtener sismcards Voyager de solo este usuario
   */
  getSimCardVoyagerWithoutReferrals(id: any, offset: number, limit: number, text?: string) {
    let textFilter = '';
    if (text) {
      textFilter = `&regex=${text}`;
    }
    return this.http.get<any>(`users/${id}/my_sims_voyager/?offset=${offset}&limit=${limit}${textFilter}`, {observe: 'response'});
  }

  /**
   * Obtener sismcards iot de un usuario incluyendo sims de un referido
   */
  getSimCardIot(id: any, offset: number, limit: number, text?: string) {
    let textFilter = '';
    if (text) {
      textFilter = `&regex=${text}`;
    }
    return this.http.get<any>(`users/${id}/sims_iot/?offset=${offset}&limit=${limit}${textFilter}`, {observe: 'response'});
  }

  /**
   * Obtener sismcards Voyager de un usuario incluyendo sims de un referido
   */
  getSimCardVoyager(id: any, offset: number, limit: number, text?: string) {
    let textFilter = '';
    if (text) {
      textFilter = `&regex=${text}`;
    }
    return this.http.get<any>(`users/${id}/sims_voyager/?offset=${offset}&limit=${limit}${textFilter}`, {observe: 'response'});
  }

  /**
   * Obtener sismcards Voyager de un usuario incluyendo sims de un referido
   */
  getE_SimCardVoyager(id: any, offset: number, limit: number, text?: string) {
    let textFilter = '';
    if (text) {
      textFilter = `&regex=${text}`;
    }
    return this.http.get<any>(`users/${id}/esims_voyager/?offset=${offset}&limit=${limit}${textFilter}`, {observe: 'response'});
  }

  // /**
  //  * Obtener sismcards de un usuario
  //  */
  // getSimCardByUser(id: any, offset?: number, limit?: number, text?: string): Observable<any> {
  //   let textFilter = '';
  //   if (text) {
  //     textFilter = `&regex=${text}`;
  //   }
  //   return this.http.get<any>(`users/${id}/sims/?offset=${offset}&limit=${limit}${textFilter}`, { observe: 'response' });
  // }

  /**
   * Obtener sismcards IOT referidas de un usuario
   */
  getSimCardByUserReferralsIot(id: any, offset?: number, limit?: number, text?: string): Observable<any> {
    let textFilter = '';
    if (text) {
      textFilter = `&regex=${text}`;
    }
    return this.http.get<any>(`users/${id}/sims_iot_by_referrals/?offset=${offset}&limit=${limit}${textFilter}`, { observe: 'response' });
  }

  /**
   * Obtener sismcards Voyager referidas de un usuario
   */
  getSimCardByUserVoyager(id: any, offset?: number, limit?: number, text?: string): Observable<any> {
    let textFilter = '';
    if (text) {
      textFilter = `&regex=${text}`;
    }
    return this.http.get<any>(`users/${id}/sims_voyager_by_referrals/?offset=${offset}&limit=${limit}${textFilter}`, { observe: 'response' });
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

  getLocationIotM2M(idSim: number) {
    return this.http.get('sim_cards/' + idSim + "/location/", { observe: 'response' });
  }

  getSimDetails(idSim: number): Observable<any> {
    return this.http.get('sim_cards/' + idSim + '/details/', { observe: 'response' });
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
   * Actualiza endpoint
   */
  updateEndpointVoyager(idSim: number, endpoint: any): Observable<any> {
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
  deleteSimCardIot(idSim: number) {
    return this.http.post("sim_cards/" + idSim + '/delete/', null, { observe: 'response' })
  }
  /**
   * Elimianr sim
   */
  deleteSimCardVoyager(idSim: number): Observable<any> {
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
   * Obtiene lista de paquetes IOT de sims para comprar
   */
  getSimsPackagesIot() {
    return this.http.get<any>('sets_sim_card_iot/', { observe: 'response' });
  }
  /**
   * Obtiene lista de paquetes de sims para comprar
   */
  getSimsPackagesVoyager(){
    return this.http.get<any>(`sets_sim_card_voyager/`, { observe: 'response' });
  }
  /**
   * Comprar sims
   */
  orderSims(order: OrderSimsVoyager): Observable<any> {
    return this.http.post<any>("sets_sim_card_voyager/order_sim/", order, { observe: 'response' });
  }
  /**
   * Comprar sims
   */
  orderSimsIot(data: OrderSims): Observable<any> {
    return this.http.post<any>('sets_sim_card_iot/order_sim/',data, { observe: 'response' });
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
   * Obtener el tiempo de duraion de las llamadas en los ultimos 30 dias
   * @param idSim Id de sim
   */
  getDurationsCalls(idSim: number): Observable<any> {
    return this.http.get(`sim_cards_tc/${idSim}/get_consumption_sim/`, { observe: 'response' });
  }

  /**
   * Obtiene historico de llamadas
   */
  getCallsHistoryApp(idSim: any): Observable<any> {
    return this.http.get<any>(`sim_cards_tc/${idSim}/CDR_sim/`, { observe: 'response' });
  }

  /**
   * Obtiene historico de pines
   */
  getPinsHistory(idSim: any): Observable<any> {
    return this.http.get<any>(`sim_cards_tc/${idSim}/recharge_history/`, { observe: 'response' });
  }

  /**
   * Activar Pins
   * @param idSim Id de sim
   */
  activatePins(idSim: number, bodyPin: { pin: number }): Observable<any> {
    return this.http.post(`sim_cards_tc/${idSim}/recharge_pin/`, bodyPin, { observe: 'response' });
  }

  /**
   * Purchase E-Sims
   */
  purchaseESims(body: { quantity: number, currency: string, organization: number }): Observable<any> {
    return this.http.post(`e_sims/buy_esims/`, body, { observe: 'response' });
  }

  // -------------------------------------------------

  registerSimCard(simCardBatch: Bic): Observable<any> {
    return this.http.post<any>("sim_cards/register_bic_by_account/", simCardBatch, { observe: 'response' });
  }
  importSimCard(simCard: any): Observable<any> {
    return this.http.post<any>("sim_cards/activate_by_iccid_by_account_movil/", simCard, { observe: 'response' });
  }
  getEndPointDetails(idSim: number) {
    return this.http.get('end_points/' + idSim + '/details/', { observe: 'response' });
  }
  getConnectivity(idSim: number) {
    return this.http.get('sim_cards/' + idSim + '/connectivity/', { observe: 'response' });
  }
  getStats(idSim: number) {
    return this.http.get('sim_cards/' + idSim + '/stats/', { observe: 'response' });
  }
  getSimCardEvents(idSim: number) {
    return this.http.get<EventSimCard[]>('sim_cards/' + idSim + '/events/', { observe: 'response' });
  }
  getSMSSimCard(idSim: number): Observable<any> {
    return this.http.get<any>('sim_cards/' + idSim + '/sms/', { observe: 'response' });
  }
  sendMessage(idSim: number, payload_param: string) {
    let sms = {
      payload: payload_param
    };
    return this.http.post('sim_cards/' + idSim + '/sms/', sms, { observe: 'response' });
  }
  activateSimCard(idSim: number) {
    return this.http.get('sim_cards/' + idSim + '/activate/', { observe: 'response' });
  }
  suspendSimCard(idSim: number) {
    return this.http.get('sim_cards/' + idSim + '/suspend/', { observe: 'response' });
  }
  sendSMS(idSim: number, payload: any): Observable<any> {
    return this.http.post<any>('sim_cards/' + idSim + '/sms_app/', payload, { observe: 'response' });
  }
  getSMS(idSim: number): Observable<any> {
    return this.http.get<any>('sim_cards/' + idSim + '/sms/', { observe: 'response' });
  }

  buyPackage(id, data): Observable<any> {
    return this.http.post<any>('sim_cards/'+id+'/activate_movil/',data, { observe: 'response' });
  }
}
