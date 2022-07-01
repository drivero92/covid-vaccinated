import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PatientsComponent } from './components/patients/patients.component'; 
import { VaccinesComponent } from './components/vaccines/vaccines.component';
import { PatientCareComponent } from './components/patient-care/patient-care.component';
import { DialogPatientComponent } from './components/dialogs/dialog-patient/dialog-patient.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialsModule } from './materials.module';
import { DialogPatientCareComponent } from './components/dialogs/dialog-patient-care/dialog-patient-care.component';
import { PatientDetailComponent } from './components/details/patient-detail/patient-detail.component';
import { PatientCareDetailComponent } from './components/details/patient-care-detail/patient-care-detail.component';
import { DialogVaccineComponent } from './components/dialogs/dialog-vaccine/dialog-vaccine.component';
import { OrderDosePipe } from './pipes/order-dose.pipe';
import { VaccineDetailComponent } from './components/details/vaccine-detail/vaccine-detail.component';
import { DialogVaccinationHistoryComponent } from './components/dialogs/dialog-vaccination-history/dialog-vaccination-history.component';
import { DialogPatientsVaccinatedHistoryComponent } from './components/dialogs/dialog-patients-vaccinated-history/dialog-patients-vaccinated-history.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    PatientsComponent,
    VaccinesComponent,
    PatientCareComponent,
    DialogPatientCareComponent,
    PatientDetailComponent,
    DialogPatientComponent,
    PatientCareDetailComponent,
    DialogVaccineComponent,
    OrderDosePipe,
    VaccineDetailComponent,
    DialogVaccinationHistoryComponent,
    DialogPatientsVaccinatedHistoryComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialsModule,   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
