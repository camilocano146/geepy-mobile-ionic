
export interface ServiceGeotrack {
  color: string;
  name: string;
  typeService: ServiceGeotrackEnum;
}

export enum ServiceGeotrackEnum {
  DIRECTION_ADVANCED,
  DISTANCE_MATRIX_ADVANCE,
  ROADS_ROUTE_TRAVELER,
  ROADS_NEAREST_ROAD,
  ROADS_SPEED_LIMITS,
  AUTOCOMPLETE,
  PLACE_DETAILS,
  FIND_PLACES,
  GEOLOCATION,
}
