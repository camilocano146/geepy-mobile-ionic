import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SimCardsPage } from './sim-cards.page';

describe('SimCardsPage', () => {
  let component: SimCardsPage;
  let fixture: ComponentFixture<SimCardsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimCardsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SimCardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
