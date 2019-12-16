import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimCardsPage } from './sim-cards.page';

const routes: Routes = [
  {
    path: '',
    component: SimCardsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimCardsPageRoutingModule {}
