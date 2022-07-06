import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFullVaccineComponent } from './dialog-full-vaccine.component';

describe('DialogFullVaccineComponent', () => {
  let component: DialogFullVaccineComponent;
  let fixture: ComponentFixture<DialogFullVaccineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFullVaccineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFullVaccineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
