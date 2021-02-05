import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShopHomePage } from './shop-home.page';

describe('ShopHomePage', () => {
  let component: ShopHomePage;
  let fixture: ComponentFixture<ShopHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShopHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
