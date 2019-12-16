import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransacitionsPage } from './transacitions.page';

describe('TransacitionsPage', () => {
  let component: TransacitionsPage;
  let fixture: ComponentFixture<TransacitionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransacitionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TransacitionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
