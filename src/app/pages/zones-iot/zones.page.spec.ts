import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ZonesPage } from './zones.page';

describe('ZonesPage', () => {
  let component: ZonesPage;
  let fixture: ComponentFixture<ZonesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ZonesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
