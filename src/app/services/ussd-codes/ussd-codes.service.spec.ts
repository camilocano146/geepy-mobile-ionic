import { TestBed } from '@angular/core/testing';

import { UssdCodesService } from './ussd-codes.service';

describe('UssdCodesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UssdCodesService = TestBed.get(UssdCodesService);
    expect(service).toBeTruthy();
  });
});
