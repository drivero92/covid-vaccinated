import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PatientsComponent } from './components/patients/patients.component'; 
import { VaccinesComponent } from './components/vaccines/vaccines.component'; 
import { PatientCareComponent } from './components/patient-care/patient-care.component'; 
import { PatientDetailComponent } from './components/details/patient-detail/patient-detail.component'; 
import { PatientCareDetailComponent } from './components/details/patient-care-detail/patient-care-detail.component';
import { VaccineDetailComponent } from './components/details/vaccine-detail/vaccine-detail.component';
import { LoginComponent } from './components/login/login.component';
import { FullVaccineComponent } from './components/full-vaccine/full-vaccine.component';

const routes: Routes = [
  //pathMatch: 'full or prefix' is:
  //full: Ignore my children and only match me. If I am not able to match all of the remaining URL segments myself, then move on
  //prefix: a partial match is enough to cause a redirect (but olny if we use redirectTo)
  //the default prefix path matching: the router is only able to match full segments
  { path: '', redirectTo: 'patientcares', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'patientCares/:id', component: PatientCareDetailComponent },
  { path: 'patientCares', component: PatientCareComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'patients/:id', component: PatientDetailComponent },
  { path: 'vaccines', component: VaccinesComponent },
  { path: 'vaccines/:id', component: VaccineDetailComponent }, 
  { path: 'fullVaccines', component: FullVaccineComponent },
  { path: '**', redirectTo: 'patientcares', pathMatch: 'prefix' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
