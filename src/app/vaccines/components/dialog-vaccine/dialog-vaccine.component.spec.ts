import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVaccineComponent } from './dialog-vaccine.component';

describe('DialogVaccineComponent', () => {
  let component: DialogVaccineComponent;
  let fixture: ComponentFixture<DialogVaccineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogVaccineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVaccineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
