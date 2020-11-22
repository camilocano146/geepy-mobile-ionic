import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IridiumHomePage } from './iridium-home.page';

describe('IridiumHomePage', () => {
  let component: IridiumHomePage;
  let fixture: ComponentFixture<IridiumHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IridiumHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IridiumHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
