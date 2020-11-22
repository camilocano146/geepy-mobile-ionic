
export class IotDeviceGeoTrack {

    public imei: number;
    public name: string;
    public description: string;
    public icon: string;
    public id: number;
    public organization: any;
    public uuid: string;
    public status: number;
    public type_device: any;

    constructor(){}
}

export interface StatusValidityActivation {
  status: number;
  title: string;
}

export interface SettingsDevice {
  label: any;
  name: string;
  deviceStatus?: number;
}
