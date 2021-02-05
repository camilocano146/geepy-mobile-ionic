import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
/**
 * Material
 */
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SimCardsPageRoutingModule } from './sim-cards-routing.module';

import { SimCardsPage } from './sim-cards.page';
import { SimModalImportICCID } from './sim-modal-import-iccid/sim-modal-import-iccid';
import { TranslateModule } from '@ngx-translate/core';
import { SimModalSettings } from './sim-modal-settings/sim-modal-settings';
import { SimModalImportONUM } from './sim-modal-import-onum/sim-modal-import-onum';
import { SimModalSendSmsComponent } from './sim-modal-send-sms/sim-modal-send-sms.component';
import { SimModalSeeSmsComponent } from './sim-modal-see-sms/sim-modal-see-sms.component';
import { AgmCoreModule } from '@agm/core';
import { PopoverModule } from 'src/app/common-components/popover/popover.module';
import { SimModalBuy } from './sim-modal-buy/sim-modal-buy.component';
import { SimModalSeeRealComponent } from './sim-modal-see-real/sim-modal-see-real.component';


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
      apiKey: "AIzaSyBMtHVqHc6m1dPc85aFmzg4uS8r6SlzosQ" + '&libraries=visualization'
    }),
    ReactiveFormsModule,
    SimCardsPageRoutingModule,
  ],
  declarations: [
    SimCardsPage,
    SimModalImportICCID,
    SimModalImportONUM,
    SimModalSettings,
    SimModalSendSmsComponent,
    SimModalSeeSmsComponent,
    SimModalBuy,
    SimModalSeeRealComponent
  ],
  entryComponents: [
    SimModalImportICCID,
    SimModalImportONUM,
    SimModalSettings,
    SimModalSendSmsComponent,
    SimModalSeeSmsComponent,
    SimModalBuy,
    SimModalSeeRealComponent
  ]
})
export class SimCardsPageModule { }
