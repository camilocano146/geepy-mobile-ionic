import {SimCard} from '../sim-card/simcard';
import {Organization} from '../organization/organization';

export interface PinVoyager {
  code: number;
  is_used?: boolean;
  sim_Card?: SimCard;
  type_pin?: TypePinVoyager;
  organization?: Organization;
  organization_id: number;
  type_pin_id: number;
}

export interface TypePinVoyager {
  id?: number;
  value: number;
  currency: string;
}
