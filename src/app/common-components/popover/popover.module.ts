import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverComponent } from 'src/app/common-components/popover/popover.component';
import { PopoverRoutingModule } from './popover-routing.module';

@NgModule({
  imports: [
    IonicModule,
    //Traductor
    TranslateModule.forChild(),

  ],
  declarations: [
    PopoverComponent
  ],
  entryComponents: [
    PopoverComponent
  ],
  exports: [
    PopoverComponent
  ]
})
export class PopoverModule { }
