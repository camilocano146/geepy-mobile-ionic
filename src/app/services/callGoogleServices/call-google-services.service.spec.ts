import { TestBed } from '@angular/core/testing';

import { CallGoogleServicesService } from './call-google-services.service';

describe('CallGoogleServicesService', () => {
  let service: CallGoogleServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallGoogleServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
