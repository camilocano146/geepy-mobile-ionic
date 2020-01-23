import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RepurchasePackagePage } from './repurchase-package.page';

describe('RepurchasePackagePage', () => {
  let component: RepurchasePackagePage;
  let fixture: ComponentFixture<RepurchasePackagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepurchasePackagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RepurchasePackagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
