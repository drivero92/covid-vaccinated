import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPatientCareComponent } from './dialog-patient-care.component';

describe('DialogPatientCareComponent', () => {
  let component: DialogPatientCareComponent;
  let fixture: ComponentFixture<DialogPatientCareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPatientCareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPatientCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
