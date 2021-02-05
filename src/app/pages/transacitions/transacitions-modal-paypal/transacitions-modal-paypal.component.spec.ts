import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransacitionsModalPaypalComponent } from './transacitions-modal-paypal.component';

describe('TransacitionsModalPaypalComponent', () => {
  let component: TransacitionsModalPaypalComponent;
  let fixture: ComponentFixture<TransacitionsModalPaypalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransacitionsModalPaypalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TransacitionsModalPaypalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
