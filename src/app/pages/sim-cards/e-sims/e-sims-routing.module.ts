import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ESimsPage } from './e-sims.page';

const routes: Routes = [
  {
    path: '',
    component: ESimsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ESimsPageRoutingModule {}
