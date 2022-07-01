import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVaccinationHistoryComponent } from './dialog-vaccination-history.component';

describe('DialogVaccinationHistoryComponent', () => {
  let component: DialogVaccinationHistoryComponent;
  let fixture: ComponentFixture<DialogVaccinationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogVaccinationHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVaccinationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
