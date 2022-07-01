import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCareDetailComponent } from './patient-care-detail.component';

describe('PatientCareDetailComponent', () => {
  let component: PatientCareDetailComponent;
  let fixture: ComponentFixture<PatientCareDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientCareDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientCareDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
