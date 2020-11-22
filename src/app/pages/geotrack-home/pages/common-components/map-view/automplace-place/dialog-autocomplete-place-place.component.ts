import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {CallGoogleServicesService} from '../../../../../../services/callGoogleServices/call-google-services.service';
import {ModalController, NavParams} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-automplace-place',
  templateUrl: './dialog-autocomplete-place-place.component.html',
  styleUrls: ['./dialog-autocomplete-place-place.component.scss'],
})
export class DialogAutocompletePlacePlaceComponent implements OnInit {
  preloadFindPlace: boolean;
  findPlaceDetails: any;
  listAutocompletePlaces: any = [];
  formControlAutocompletePlace: FormControl = new FormControl('', [Validators.maxLength(200)]);

  constructor(private callGoogleServices: CallGoogleServicesService,
              private dialogRef: ModalController,
              private translate: TranslateService,
              private navParams: NavParams,) {
    if (this.callGoogleServices.nameFindPlace) {
      this.formControlAutocompletePlace.setValue(this.callGoogleServices.nameFindPlace);
      if (this.callGoogleServices.idFindPlace) {
        this.callGoogleServices.getPlaceDetails(this.callGoogleServices.idFindPlace).subscribe(
          value => {
            // @ts-ignore
            this.findPlaceDetails = value.result;
            console.log(value);
            this.preloadFindPlace = false;
          }
        );
      }
    }
  }

  ngOnInit() {}

  changeText() {
    if (this.formControlAutocompletePlace.valid) {
      const text = this.formControlAutocompletePlace.value;
      this.callGoogleServices.getPlaceAutocomplete(text).subscribe(
        value => {
          // @ts-ignore
          this.listAutocompletePlaces = value.predictions;
        }
      );
    }
  }

  /**
   * Mensaje de error NIT
   */
  getErrorMessageAutocomplete() {
    return this.formControlAutocompletePlace.hasError('required')
      ? 'Este campo es obligatorio'
      // : this.formControlTextAutocomplete.hasError('minlength')
      //   ? 'Longitud mínima de 1 cacteres'
      : this.formControlAutocompletePlace.hasError('maxlength')
        ? 'Longitud máxima de 200 cacteres'
        : this.formControlAutocompletePlace.hasError('pattern')
          ? 'Solo se permiten caracteres numéricos'
          : '';
  }

  choosePlace(place: any) {
    this.preloadFindPlace = true;
    this.callGoogleServices.getPlaceDetails(place.place_id).subscribe(
      value => {
        // @ts-ignore
        this.findPlaceDetails = value.result;
        console.log(value);
        this.preloadFindPlace = false;
        this.callGoogleServices.nameFindPlace = place.description;
        this.callGoogleServices.idFindPlace = place.place_id;
      }
    );
  }

  showFindPlaceInMap() {
    console.log(this.findPlaceDetails);
    this.dialogRef.dismiss(this.findPlaceDetails);
  }

  clearText(inputPlace: HTMLInputElement) {
    this.formControlAutocompletePlace.reset();
    this.formControlAutocompletePlace.markAsTouched();
    inputPlace.focus();
    this.callGoogleServices.nameFindPlace = '';
    this.callGoogleServices.idFindPlace = '';
  }
}
