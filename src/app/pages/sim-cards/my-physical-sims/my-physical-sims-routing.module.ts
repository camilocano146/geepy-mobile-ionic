import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyPhysicalSimsPage } from './my-physical-sims-page.component';

const routes: Routes = [
  {
    path: '',
    component: MyPhysicalSimsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyPhysicalSimsPageRoutingModule {}
