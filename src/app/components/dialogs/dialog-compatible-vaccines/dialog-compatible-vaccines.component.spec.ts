import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCompatibleVaccinesComponent } from './dialog-compatible-vaccines.component';

describe('DialogCompatibleVaccinesComponent', () => {
  let component: DialogCompatibleVaccinesComponent;
  let fixture: ComponentFixture<DialogCompatibleVaccinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCompatibleVaccinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCompatibleVaccinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
