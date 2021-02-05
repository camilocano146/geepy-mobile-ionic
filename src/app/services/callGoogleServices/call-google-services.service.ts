import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Route} from '../../models/geocerca/Geocerca';
import {Geofence} from '../../models/device/device';

@Injectable({
  providedIn: 'root'
})
export class CallGoogleServicesService {
  private readonly key = 'AIzaSyB68dNEpuEPDQRohfin_kr16b5CpIUqH3w';
  private readonly urlGoogleMaps = 'google-apis/maps/';
  private readonly urlGoogleRoads = 'google-apis/roads/';
  private _nameFindPlace: string;
  private _idFindPlace: string;

  constructor(private http: HttpClient) { }

  buildBody(url) {
    return {
      endpoint: url,
    };
  }

  getDirectionAdvanced(route: Route, units: any) {
    const language = document.getElementsByTagName('html')[0].getAttribute('lang');
    const googleUrl = `/directions/json?origin=${route.initPoint.lat},${route.initPoint.lng}&destination=${route.finishPoint.lat},${route.finishPoint.lng}&units=${units}&language=${language}&key=${this.key}`;
    return this.http.post(this.urlGoogleMaps, this.buildBody(googleUrl));
  }

  getPlaceAutocomplete(text: any) {
    const googleUrl = `/place/autocomplete/json?input=${text}&key=${this.key}`;
    return this.http.post(this.urlGoogleMaps, this.buildBody(googleUrl));
  }

  findNearPlace(point: Geofence) {
    const googleUrl = `/place/nearbysearch/json?location=${point.lat},${point.long}&radius=${point.radius}&key=${this.key}`;
    return this.http.post(this.urlGoogleMaps, this.buildBody(googleUrl));
  }

  findNearPlaceKeyWord(point: Geofence, text: any) {
    const googleUrl = `/place/nearbysearch/json?location=${point.lat},${point.long}&radius=${point.radius}&keyword=${text}&key=${this.key}`;
    return this.http.post(this.urlGoogleMaps, this.buildBody(googleUrl));
  }

  getPlaceDetails(placeId: any) {
    const googleUrl = `/place/details/json?place_id=${placeId}&key=${this.key}`;
    return this.http.post(this.urlGoogleMaps, this.buildBody(googleUrl));
  }

  getDistanceMatrix(data: Route, modeTravel: any, units: any) {
    const googleUrl = `/distancematrix/json?origins=${data.initPoint.lat},${data.initPoint.lng}&destinations=${data.finishPoint.lat},${data.finishPoint.lng}&mode=${modeTravel}&units=${units}&key=${this.key}`;
    return this.http.post(this.urlGoogleMaps, this.buildBody(googleUrl));
  }

  getSpeedLimits(path: string) {
    const googleUrl = `/speedLimits?path=${path}&key=${this.key}`;
    return this.http.post(this.urlGoogleRoads, this.buildBody(googleUrl));
  }

  getNearestRoad(data: Geofence) {
    const googleUrl = `/nearestRoads?points=${data.lat},${data.long}&key=${this.key}`;
    return this.http.post(this.urlGoogleRoads, this.buildBody(googleUrl));
  }

  getRouteTraveler(path: string) {
    const googleUrl = `/snapToRoads?path=-35.27801,149.12958|-35.28032,149.12907|-35.28099,149.12929|-35.28144,149.12984|-35.28194,149.13003|-35.28282,149.12956|-35.28302,149.12881|-35.28473,149.12836&interpolate=true&key=AIzaSyCwD-PQ8FaSOFjvsfbfsDHIaUyHRE92sSE`
    return this.http.post(this.urlGoogleRoads, this.buildBody(googleUrl));
  }

  get nameFindPlace(): string {
    return this._nameFindPlace;
  }

  set nameFindPlace(value: string) {
    this._nameFindPlace = value;
  }

  get idFindPlace(): string {
    return this._idFindPlace;
  }

  set idFindPlace(value: string) {
    this._idFindPlace = value;
  }
}
