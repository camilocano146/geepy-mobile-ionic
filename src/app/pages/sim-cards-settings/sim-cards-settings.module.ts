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
import { TranslateModule } from '@ngx-translate/core';
import { AgmCoreModule } from '@agm/core';
import { PopoverModule } from 'src/app/common-components/popover/popover.module';
import { SimCardsSettingsPageRoutingModule } from './sim-cards-settings-routing.module';
import { SimCardsSettingsPage } from './sim-cards-settings.page';
import { SimModalSendSmsComponent } from './sim-modal-send-sms/sim-modal-send-sms.component';
import { SimModalSeeSmsComponent } from './sim-modal-see-sms/sim-modal-see-sms.component';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';

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
    SimCardsSettingsPageRoutingModule,
  ],
  declarations: [
    SimCardsSettingsPage,
    SimModalSendSmsComponent,
    SimModalSeeSmsComponent
  ],
  entryComponents: [
    SimModalSendSmsComponent,
    SimModalSeeSmsComponent
  ],
  providers: [
    PhotoViewer
  ]
})
export class SimCardsSettingsPageModule {}
