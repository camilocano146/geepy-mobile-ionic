import {Component, OnInit} from '@angular/core';
import {CallGoogleServicesService} from '../../../../../../services/callGoogleServices/call-google-services.service';
import {FormControl, Validators} from '@angular/forms';
import {Route} from '../../../../../../models/geocerca/Geocerca';
import {Option} from '../../../../../../models/option/Option';
import {TranslateService} from '@ngx-translate/core';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-place-autocomplete',
  templateUrl: './dialog-direction-advanced.component.html',
  styleUrls: ['./dialog-direction-advanced.component.scss']
})
export class DialogDirectionAdvancedComponent implements OnInit {
  routeDetails: any;
  error: boolean;
  errorMessage: string;
  preload: boolean;
  formControlUnits: FormControl = new FormControl('' ,
    [Validators.required]
  );
  units: Option[];
  public listSpeedLimits: any;
  public speedLimitsInitPoint: any;
  public speedLimitsFinishPoint: any;
  public data: Route = this.navParams.get('data');

  constructor(private dialogRef: ModalController,
              private translate: TranslateService,
              private navParams: NavParams,
              private callGoogleServices: CallGoogleServicesService) {
    this.findRoute();
    this.fillUnits();

    // callGoogleServices.getRouteTraveler(null).subscribe(
    //   value => {
    //     console.log(value);
    //   }
    // );
  }

  fillUnits() {
    this.units = [
      {name: this.translate.instant('geo.common.map.measurement_units.metric'), type: 'metric'},
      {name: this.translate.instant('geo.common.map.measurement_units.imperial'), type: 'imperial'},
    ];
    this.formControlUnits.setValue(this.units[0].type);
  }

  ngOnInit(): void {
    this.speedLimitOriginPoint();
    this.speedLimitFinishPoint();
  }

  speedLimitOriginPoint() {
    console.log(`${this.data.initPoint.lat},${this.data.initPoint.lng}`);
    this.callGoogleServices.getSpeedLimits(`${this.data.initPoint.lat},${this.data.initPoint.lng}`).subscribe(
      value1 => {
        console.log(value1);
        // @ts-ignore
        this.speedLimitsInitPoint = value1?.speedLimits;
        if (this.speedLimitsInitPoint) {
          this.speedLimitsInitPoint = this.speedLimitsInitPoint[0];
        }
      }
    );
  }

  speedLimitFinishPoint() {
    this.callGoogleServices.getSpeedLimits(`${this.data.finishPoint.lat},${this.data.finishPoint.lng}`).subscribe(
      value1 => {
        console.log(value1);
        // @ts-ignore
        this.speedLimitsFinishPoint = value1.speedLimits;
        if (this.speedLimitsInitPoint) {
          this.speedLimitsInitPoint = this.speedLimitsInitPoint[0];
        }
      }
    );
  }

  findRoute() {
    this.preload = true;
    const units = this.formControlUnits.value;
    this.callGoogleServices.getDirectionAdvanced(this.data, units).subscribe(
      value => {
        // @ts-ignore
        this.routeDetails = value.routes;
        console.log(value);
        this.preload = false;
        this.callGoogleServices.getSpeedLimits(this.getPointsPathRouteForSpeedLimits()).subscribe(
          value1 => {
            console.log(value1);
            this.listSpeedLimits = value1;
          }
        );
      }
    );
  }

  private getPointsPathRouteForSpeedLimits() {
    let result = '';
    if (this.routeDetails) {
      const legs = this.routeDetails[0]?.legs;
      if (legs) {
        for (const leg of legs) {
          const steps = leg.steps;
          for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            result += step.end_location.lat + ',' + step.end_location.lng;
            if (i !== steps.length) {
              result += '|';
            }
          }
        }
      }
    }
    return result;
  }

  addInstructionDiv(divElementInstruction: HTMLDivElement, step: google.maps.DirectionsStep) {
    const temp = document.createElement('div');
    // @ts-ignore
    temp.innerHTML = step.html_instructions;
    temp.style.display = 'inline';
    divElementInstruction.replaceWith(temp);
  }

  showInMap() {
    this.dialogRef.dismiss(this.routeDetails);
  }
}
