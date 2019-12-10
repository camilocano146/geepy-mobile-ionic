import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SendCodePage } from './send-code.page';

describe('SendCodePage', () => {
  let component: SendCodePage;
  let fixture: ComponentFixture<SendCodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendCodePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SendCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
