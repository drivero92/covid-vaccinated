import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullVaccineComponent } from './full-vaccine.component';

describe('FullVaccineComponent', () => {
  let component: FullVaccineComponent;
  let fixture: ComponentFixture<FullVaccineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullVaccineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullVaccineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
