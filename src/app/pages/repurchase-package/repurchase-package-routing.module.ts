import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RepurchasePackagePage } from './repurchase-package.page';

const routes: Routes = [
  {
    path: '',
    component: RepurchasePackagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepurchasePackagePageRoutingModule {}
