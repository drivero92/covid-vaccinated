import { TestBed } from '@angular/core/testing';

import { PatientCareService } from './patient-care.service';

describe('PatientCareService', () => {
  let service: PatientCareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientCareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
