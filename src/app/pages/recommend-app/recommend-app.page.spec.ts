import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecommendAppPage } from './recommend-app.page';

describe('RecommendAppPage', () => {
  let component: RecommendAppPage;
  let fixture: ComponentFixture<RecommendAppPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendAppPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
