import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FAQPage } from './f-a-q-page.component';

const routes: Routes = [
  {
    path: '',
    component: FAQPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FAQPageRoutingModule {}
