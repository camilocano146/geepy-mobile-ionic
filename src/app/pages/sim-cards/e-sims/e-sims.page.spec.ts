import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ESimsPage } from './e-sims.page';

describe('ESimsPage', () => {
  let component: ESimsPage;
  let fixture: ComponentFixture<ESimsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ESimsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ESimsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
