import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GeotrackHomePage } from './geotrack-home-page.component';

describe('GeotrackHomeComponent', () => {
  let component: GeotrackHomePage;
  let fixture: ComponentFixture<GeotrackHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeotrackHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GeotrackHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
