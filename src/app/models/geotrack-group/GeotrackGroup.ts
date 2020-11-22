import {Device} from '../device/device';

export interface GroupGeotrack {
  id?: number,
  name: string,
  description: string,
  organization?: any,
  devices?: string[],
  devices_group?: Device[],
}
