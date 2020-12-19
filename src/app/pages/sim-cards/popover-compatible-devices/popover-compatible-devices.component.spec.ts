import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverCompatibleDevicesComponent } from './popover-compatible-devices.component';

describe('PopoverActivationComponent', () => {
  let component: PopoverCompatibleDevicesComponent;
  let fixture: ComponentFixture<PopoverCompatibleDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverCompatibleDevicesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverCompatibleDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
