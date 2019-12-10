import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivateAccountPage } from './activate-account.page';

const routes: Routes = [
  {
    path: '',
    component: ActivateAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivateAccountPageRoutingModule {}
