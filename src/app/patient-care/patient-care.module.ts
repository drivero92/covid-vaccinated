import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientCareRoutingModule } from './patient-care-routing.module';
import { SharedModule } from '../shared/shared.module';

import { PatientCareComponent } from './components/patient-care/patient-care.component';
import { DialogPatientCareComponent } from './components/dialog-patient-care/dialog-patient-care.component';

@NgModule({
  declarations: [
    PatientCareComponent,
    DialogPatientCareComponent,
  ],
  imports: [
    CommonModule,
    PatientCareRoutingModule,
    SharedModule
  ]
})
export class PatientCareModule { }
