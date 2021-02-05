import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SimModalSeeSmsComponent } from './sim-modal-see-sms.component';

describe('SimModalSeeSmsComponent', () => {
  let component: SimModalSeeSmsComponent;
  let fixture: ComponentFixture<SimModalSeeSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimModalSeeSmsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SimModalSeeSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
