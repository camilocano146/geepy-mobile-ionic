import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimCardsSettingsPage } from './sim-cards-settings.page';

const routes: Routes = [
  {
    path: '',
    component: SimCardsSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimCardsSettingsPageRoutingModule {}
