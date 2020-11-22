import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShopCartPage } from './shop-cart.page';

describe('ShopCartPage', () => {
  let component: ShopCartPage;
  let fixture: ComponentFixture<ShopCartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopCartPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShopCartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
