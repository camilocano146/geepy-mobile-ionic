import { TestBed } from '@angular/core/testing';

import { VoyagerPlansService } from './voyager-plans.service';

describe('VoyagerPlansService', () => {
  let service: VoyagerPlansService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoyagerPlansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
