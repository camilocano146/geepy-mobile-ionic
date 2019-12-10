import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendCodePage } from './send-code.page';

const routes: Routes = [
  {
    path: '',
    component: SendCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendCodePageRoutingModule {}
