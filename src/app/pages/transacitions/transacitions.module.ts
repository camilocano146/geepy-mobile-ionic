import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransacitionsPageRoutingModule } from './transacitions-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { TransacitionsPage } from './transacitions.page';
import { TransacitionsModalStripeComponent } from './transacitions-modal-stripe/transacitions-modal-stripe.component';
import { PopoverModule } from 'src/app/common-components/popover/popover.module';
import { TransacitionsModalPaypalComponent } from './transacitions-modal-paypal/transacitions-modal-paypal.component';
import { TransacitionsModalSeeComponent } from './transacitions-modal-see/transacitions-modal-see.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    IonicModule,
    ReactiveFormsModule,
    PopoverModule,
    TransacitionsPageRoutingModule
  ],
  declarations: [
    TransacitionsPage,
    TransacitionsModalStripeComponent,
    TransacitionsModalPaypalComponent,
    TransacitionsModalSeeComponent
  ],
  entryComponents: [
    TransacitionsModalStripeComponent,
    TransacitionsModalPaypalComponent,
    TransacitionsModalSeeComponent
  ]
})
export class TransacitionsPageModule {}
