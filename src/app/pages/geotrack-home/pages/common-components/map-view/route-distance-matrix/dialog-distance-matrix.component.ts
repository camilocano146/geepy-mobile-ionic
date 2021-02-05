import {Component, OnInit} from '@angular/core';
import {CallGoogleServicesService} from '../../../../../../services/callGoogleServices/call-google-services.service';
import {FormControl, Validators} from '@angular/forms';
import {Route} from '../../../../../../models/geocerca/Geocerca';
import {Option} from '../../../../../../models/option/Option';
import {TranslateService} from '@ngx-translate/core';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-place-autocomplete',
  templateUrl: './dialog-distance-matrix.component.html',
  styleUrls: ['./dialog-distance-matrix.component.scss']
})
export class DialogDistanceMatrixComponent implements OnInit {
  routeDetails: any;
  error: boolean;
  errorMessage: string;
  preload: boolean;
  formControlModeTravel: FormControl = new FormControl('' ,
    [Validators.required]
  );
  formControlUnits: FormControl = new FormControl('' ,
    [Validators.required]
  );
  modesTravel: Option[];
  units: Option[];
  public data: Route = this.navParams.get('data');

  constructor(private dialogRef: ModalController,
              private translate: TranslateService,
              private navParams: NavParams,
              private callGoogleServices: CallGoogleServicesService) {
    this.routeTime();
    this.fillUnits();
    this.fillModesTravel();
  }

  fillUnits() {
    this.units = [
      {name: this.translate.instant('geo.common.map.measurement_units.metric'), type: 'metric'},
      {name: this.translate.instant('geo.common.map.measurement_units.imperial'), type: 'imperial'},
    ];
    this.formControlUnits.setValue(this.units[0].type);
  }

  fillModesTravel() {
    this.modesTravel = [
      {name: this.translate.instant('geo.common.map.travel_modes.driving'), type: 'driving'},
      {name: this.translate.instant('geo.common.map.travel_modes.walking'), type: 'walking'},
      {name: this.translate.instant('geo.common.map.travel_modes.bicycling'), type: 'bicycling'}
    ];
    this.formControlModeTravel.setValue(this.modesTravel[0].type);
  }

  ngOnInit(): void {
  }

  routeTime() {
    this.preload = true;
    const modeTravel = this.formControlModeTravel.value;
    const units = this.formControlUnits.value;
    this.callGoogleServices.getDistanceMatrix(this.data, modeTravel, units).subscribe(
      value => {
        console.log(value);
        // @ts-ignore
        this.routeDetails = value;
        this.preload = false;
      }
    );
  }
}
