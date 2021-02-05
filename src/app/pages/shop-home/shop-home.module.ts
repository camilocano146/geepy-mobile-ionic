import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopHomePageRoutingModule } from './shop-home-routing.module';

import { ShopHomePage } from './shop-home.page';
import { PopoverModule } from 'src/app/common-components/popover/popover.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    ShopHomePageRoutingModule
  ],
  declarations: [ShopHomePage]
})
export class ShopHomePageModule {}
