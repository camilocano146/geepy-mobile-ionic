import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectPlatformPage } from './select-platform.page';

const routes: Routes = [
  {
    path: '',
    component: SelectPlatformPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectPlatformPageRoutingModule {}
