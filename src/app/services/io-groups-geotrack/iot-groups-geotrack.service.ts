import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class IotGroupsGeotrackService {

    constructor(private http: HttpClient) { }

    /**
     * Traer grupos
     */
    getIotGroupsGeoTrack(page, limit) {
        return this.http.get<any>(`groups_devices_iot/?limit=${limit}&offset=${page}`);
    }
    /**
     * Crear grupo
     */
    createGroup(data) {
      return this.http.post<any>(`groups_devices_iot/`, data, { observe: 'response' });
    }
    /**
     * Editar grupo
     */
    editGroup(idGroup, data) {
      return this.http.patch<any>(`groups_devices_iot/${idGroup}/`, data, { observe: 'response' });
    }
    /**
     * Editar los dispositivos de un grupo
     */
    editDevices(idGroup: string, devices: any) {
      return this.http.patch<any>(`groups_devices_iot/${idGroup}/`, devices, { observe: 'response' });
    }

    /**
     * Traer dispositivo por ID
     */
    getIotDevicesGeoTrackByID(idGroup) {
      return this.http.get<any>(`groups_devices_iot/${idGroup}/`, { observe: 'response' });
    }

    /**
     * Trae todos los grupos de una organizacion
     */
    getIotGroupsGeoTrackByOrganizationId(idOrganization: any, page: number, limit: any) {
      return this.http.get<any>(`organizations/${idOrganization}/groups_devices_iot/?limit=${limit}&offset=${page}`);
    }

    /**
     * Registrar conexión de socket
     */
    registerSocket(idGroup, dataConnection) {
      return this.http.post<any>(`groups_devices_iot/${idGroup}/new_connection/`, dataConnection, { observe: 'response' });
    }
}
