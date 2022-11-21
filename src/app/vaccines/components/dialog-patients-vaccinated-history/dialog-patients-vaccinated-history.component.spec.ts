import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPatientsVaccinatedHistoryComponent } from './dialog-patients-vaccinated-history.component';

describe('DialogPatientsVaccinatedHistoryComponent', () => {
  let component: DialogPatientsVaccinatedHistoryComponent;
  let fixture: ComponentFixture<DialogPatientsVaccinatedHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPatientsVaccinatedHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPatientsVaccinatedHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
