import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {HelpComponent} from './help.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    IonicModule,
    // Traductor
    TranslateModule.forChild(),
    CommonModule,
  ],
  declarations: [
    HelpComponent
  ],
  entryComponents: [
    HelpComponent
  ],
  exports: [
    HelpComponent
  ]
})
export class HelpModule { }
