import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UssdCodesPage } from './ussd-codes.page';

describe('UssdCodesPage', () => {
  let component: UssdCodesPage;
  let fixture: ComponentFixture<UssdCodesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UssdCodesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UssdCodesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
