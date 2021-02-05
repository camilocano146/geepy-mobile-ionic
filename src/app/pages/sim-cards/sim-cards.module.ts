import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
/**
 * Material
 */
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {SimCardsPageRoutingModule} from './sim-cards-routing.module';

import {SimCardsPage} from './sim-cards.page';
import {SimModalImportICCID} from './sim-modal-import-iccid/sim-modal-import-iccid';
import {TranslateModule} from '@ngx-translate/core';
import {SimModalImportONUM} from './sim-modal-import-onum/sim-modal-import-onum';
import {AgmCoreModule} from '@agm/core';
import {PopoverModule} from 'src/app/common-components/popover/popover.module';
import {SimModalSeeRealComponent} from './sim-modal-see-real/sim-modal-see-real.component';
import {SimModalESimBuy} from './sim-modal-buy-e-sim/sim-modal-buy.component';
import {SimModalESimsInstructionsAndroidComponent} from './sim-modal-e-sim-instructions-android/sim-modal-e-sims-instructions-android.component';
import {SimModalESimsInstructionsIosComponent} from './sim-modal-e-sim-instructions-ios/sim-modal-e-sims-instructions-ios.component';
import {MatDividerModule} from '@angular/material/divider';
import {PopoverActivationComponent} from './popover-activation/popover-activation.component';
import {PopoverCompatibleDevicesComponent} from './popover-compatible-devices/popover-compatible-devices.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {SimChooseCourierCountryModal} from './sim-buy-page/sim-choose-courier-country/sim-choose-courier-country-modal.component';
import {AgmDirectionModule} from 'agm-direction';


@NgModule({
  imports: [
    PopoverModule,
    CommonModule,
    FormsModule,
    IonicModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    //Traductor
    TranslateModule.forChild(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBMtHVqHc6m1dPc85aFmzg4uS8r6SlzosQ' + '&libraries=visualization'
    }),
    ReactiveFormsModule,
    SimCardsPageRoutingModule,
    MatDividerModule,
    MatAutocompleteModule,
    AgmDirectionModule,
  ],
  declarations: [
    SimCardsPage,
    SimModalImportICCID,
    SimModalImportONUM,
    SimModalSeeRealComponent,
    SimModalESimBuy,
    SimModalESimsInstructionsAndroidComponent,
    SimModalESimsInstructionsIosComponent,
    PopoverActivationComponent,
    PopoverCompatibleDevicesComponent,
    SimChooseCourierCountryModal,
  ],
  entryComponents: [
    SimModalImportICCID,
    SimModalImportONUM,
    SimModalSeeRealComponent,
    SimModalESimBuy,
    SimModalESimsInstructionsAndroidComponent,
    SimModalESimsInstructionsIosComponent,
    PopoverActivationComponent,
    PopoverCompatibleDevicesComponent,
    SimChooseCourierCountryModal,
  ]
})
export class SimCardsPageModule { }
