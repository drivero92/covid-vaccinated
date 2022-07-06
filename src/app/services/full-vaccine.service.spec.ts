import { TestBed } from '@angular/core/testing';

import { FullVaccineService } from './full-vaccine.service';

describe('FullVaccineService', () => {
  let service: FullVaccineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FullVaccineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
