import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransacitionsPage } from './transacitions.page';

const routes: Routes = [
  {
    path: '',
    component: TransacitionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransacitionsPageRoutingModule {}
