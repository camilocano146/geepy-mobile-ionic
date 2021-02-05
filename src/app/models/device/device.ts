
export class Device {
    public id: number;
    public imei: string;
    public user: string;
    public organization: string;
    public account: string;
    public name: string;
    public created_at: string;
    public networkStatus: string;
    public org_id: number;
    public organization_details: any;
    public iot_device_label_details: any;
    public platforms_device: any;
    public status: number;
    public iot_device_label: any;
    // public lastIncomingInformationDevice: IncomingInformationDevice;
    public listInfoDevice?: InformationDeviceRoutePoint[];
    public realTimePints?: IncomingRouteDevice[];
    public historicalRoutes?: InfoRoutes;
    public geofence: Geofence[];
    velocity: Velocity;

    constructor(){}
}

export interface Velocity {
  vel?: number;
  isActive: boolean;
}

export interface Geofence {
  lat: number;
  long: number;
  radius: number;
}

export interface InfoRoutes {
  routeData: RouteData[];
  incomingRouteDevice: IncomingRouteDevice[];
}

export interface InformationDeviceRoutePoint {
  lat?: number;
  lng?: number;
  battery?: number;
  specificTime?: string;
}

export interface RouteData {
  points: number;
  specificTimeOrigin: string;
  specificTimeFinish: string;
}

export interface IncomingRouteDevice {
  originPoint: InformationDeviceRoutePoint;
  destinationPoint: InformationDeviceRoutePoint;
  wayPoints: WayRoutePoint[];
}

// export interface ExtremeRoutePoint {
//   lat?: number;
//   lng?: number;
// }

export interface WayRoutePoint {
  location: InformationDeviceRoutePoint;
}
