import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectPlatformPageRoutingModule } from './select-platform-routing.module';

import { SelectPlatformPage } from './select-platform.page';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'src/app/common-components/popover/popover.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverModule,
    TranslateModule.forChild(),
    SelectPlatformPageRoutingModule
  ],
  declarations: [SelectPlatformPage]
})
export class SelectPlatformPageModule {}
