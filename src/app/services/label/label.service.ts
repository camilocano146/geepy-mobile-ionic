import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LabelService {

    constructor(private http: HttpClient) { }

    /**
     * Trae etiquetas de todas las organization
     */
    getAllLabels(page, limit) {
        return this.http.get<any>(`iot_device_labels/?limit=${limit}&offset=${page}`);
    }

    /**
     * Trae todos las etiquetas de una organizacion
     */
    getAllLabelsByOrganizationId(idOrganization: number, page: number, limit: number) {
      return this.http.get<any>(`organizations/${idOrganization}/iot_device_labels/?limit=${limit}&offset=${page}`);
    }

    /**
     * Crear etiquerta
     */
    createLabel(data) {
        return this.http.post<any>(`iot_device_labels/`, data, { observe: "response" });
    }

    /**
     * Ediot etiquerta
     */
    editLabel(id,data) {
        return this.http.patch<any>(`iot_device_labels/${id}/`, data, { observe: "response" });
    }
}
