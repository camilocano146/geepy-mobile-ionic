import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectPlatformPage } from './select-platform.page';

describe('SelectPlatformPage', () => {
  let component: SelectPlatformPage;
  let fixture: ComponentFixture<SelectPlatformPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPlatformPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPlatformPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
