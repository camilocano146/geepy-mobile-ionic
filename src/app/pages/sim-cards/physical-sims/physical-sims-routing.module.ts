import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {PhysicalSimsPage} from './physical-sims-page.component';
import {SimBuyPage} from '../sim-buy-page/sim-buy-page.component';
import {SimChooseCourierCountryModal} from '../sim-buy-page/sim-choose-courier-country/sim-choose-courier-country-modal.component';

const routes: Routes = [
  {
    path: '',
    component: PhysicalSimsPage,
  },
  {
    path: 'order',
    component: SimBuyPage
  },
  {
    path: 'choose-courier',
    component: SimChooseCourierCountryModal
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhysicalSimsPageRoutingModule {
}
