import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VaccinesRoutingModule } from './vaccines-routing.module';
import { SharedModule } from '../shared/shared.module';

import { VaccinesComponent } from './components/vaccines/vaccines.component';
import { FullVaccineComponent } from './components/full-vaccine/full-vaccine.component';
import { DialogVaccineComponent } from './components/dialog-vaccine/dialog-vaccine.component';
import { DialogPatientsVaccinatedHistoryComponent } from './components/dialog-patients-vaccinated-history/dialog-patients-vaccinated-history.component';
import { DialogCompatibleVaccinesComponent } from './components/dialog-compatible-vaccines/dialog-compatible-vaccines.component';

@NgModule({
  declarations: [
    VaccinesComponent,
    FullVaccineComponent,
    DialogVaccineComponent,
    DialogPatientsVaccinatedHistoryComponent,
    DialogCompatibleVaccinesComponent,
  ],
  imports: [
    CommonModule,
    VaccinesRoutingModule,
    SharedModule
  ]
})
export class VaccinesModule { }
