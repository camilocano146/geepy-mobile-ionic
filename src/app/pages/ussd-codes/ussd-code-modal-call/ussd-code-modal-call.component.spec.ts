import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UssdCodeModalCallComponent } from './ussd-code-modal-call.component';

describe('UssdCodeModalCallComponent', () => {
  let component: UssdCodeModalCallComponent;
  let fixture: ComponentFixture<UssdCodeModalCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UssdCodeModalCallComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UssdCodeModalCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
