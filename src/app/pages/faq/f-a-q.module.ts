import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FAQPageRoutingModule } from './f-a-q-routing.module';

import { FAQPage } from './f-a-q-page.component';
import { PopoverModule } from 'src/app/common-components/popover/popover.module';
import { TranslateModule } from '@ngx-translate/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PopoverModule,
    TranslateModule.forChild(),
    FAQPageRoutingModule,
    MatExpansionModule,
    MatListModule
  ],
  declarations: [FAQPage]
})
export class FAQPageModule {}
