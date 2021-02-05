import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransacitionsModalStripeComponent } from './transacitions-modal-stripe.component';

describe('TransacitionsModalStripeComponent', () => {
  let component: TransacitionsModalStripeComponent;
  let fixture: ComponentFixture<TransacitionsModalStripeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransacitionsModalStripeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TransacitionsModalStripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
