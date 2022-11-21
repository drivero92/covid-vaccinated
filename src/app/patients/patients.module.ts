import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientsRoutingModule } from './patients-routing.module';
import { SharedModule } from '../shared/shared.module';

import { PatientsComponent } from './components/patients/patients.component';
import { DialogPatientComponent } from './components/dialog-patient/dialog-patient.component';
import { DialogVaccinationHistoryComponent } from './components/dialog-vaccination-history/dialog-vaccination-history.component';


@NgModule({
  declarations: [
    PatientsComponent,
    DialogPatientComponent,
    DialogVaccinationHistoryComponent,
  ],
  imports: [
    CommonModule,
    PatientsRoutingModule,
    SharedModule
  ]
})
export class PatientsModule { }
