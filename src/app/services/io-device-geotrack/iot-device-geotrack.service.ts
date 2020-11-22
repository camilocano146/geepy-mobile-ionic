import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Device} from '../../models/device/device';

@Injectable({
    providedIn: 'root'
})
export class IotDeviceGeotrackService {
    private _listDevicesDisplayed: Device[] = [];

    constructor(private http: HttpClient) { }

    /**
     * Traer dispositivos
     */
    getIotDevicesGeoTrack(page, limit) {
        return this.http.get<any>(`devices_iot/?limit=${limit}&offset=${page}`);
    }
    /**
     * Trae todos los dispositivos de una organizacion
     */
    getAllDevicesGeoTrackByOrganizationId(idOrganization: number, page: number, limit: number) {
      return this.http.get<any>(`organizations/${idOrganization}/devices_iot/?limit=${limit}&offset=${page}`);
    }
    /**
     * Traer dispositivo por ID
     */
    getIotDevicesGeoTrackByID(id) {
        return this.http.get<any>(`devices_iot/${id}/`, { observe: 'response' });
    }
    /**
     * Traer tipos
     */
    getTypesIotDeviceGeotrack() {
        return this.http.get<any>(`type_device_iot/`, { observe: 'response' });
    }
    /**
    * Traer plataformas
    */
    getPlatformsIotDeviceGeotrack() {
        return this.http.get<any>(`platform_device_iot/`, { observe: 'response' });
    }
    /**
     * Registar dispositivo
     */
    register(data){
        return this.http.post<any>(`devices_iot/`,data, { observe: 'response' });
    }
    /**
     * Editar dispositivo
     */
    editDevice(deviceId, body) {
      return this.http.patch<any>(`devices_iot/${deviceId}/`, body, { observe: 'response' });
    }
    /**
     * Registrar conexión de socket
     */
    registerSocket(dataConnection) {
        return this.http.post<any>(`devices_iot/new_connection_imei_id/`,dataConnection, { observe: 'response' });
    }
    /**
     * Activar IMEI
     */
    activateIMEI(data) {
        return this.http.post<any>(`devices_iot/activate_imei/`,data, { observe: 'response' });
    }

    /**
     * Trar rutas por las que ha pasado un dispositivo para mostrar en el mapa
     */
    getRoutesMapForDeviceId(dates: any) {
      return this.http.post<any>(`devices_iot/imei_records_in_date_range/`, dates);
    }

    getDevicesOfUser(idUser, limit, page) {
        console.log(idUser, limit, page);
        return this.http.get<any>(`users/${idUser}/devices_iot/?limit=${limit}&offset=${page}`);
    }

    get listDevicesDisplayed(): Device[] {
        return this._listDevicesDisplayed;
    }

    set listDevicesDisplayed(value: Device[]) {
        this._listDevicesDisplayed = value;
    }
}
