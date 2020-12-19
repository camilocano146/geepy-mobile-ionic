import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SimModalBuyComponent } from './sim-choose-courier-country-modal.component';

describe('SimModalBuyComponent', () => {
  let component: SimModalBuyComponent;
  let fixture: ComponentFixture<SimModalBuyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimModalBuyComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SimModalBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
