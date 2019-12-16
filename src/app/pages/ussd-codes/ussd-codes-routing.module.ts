import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UssdCodesPage } from './ussd-codes.page';

const routes: Routes = [
  {
    path: '',
    component: UssdCodesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UssdCodesPageRoutingModule {}
