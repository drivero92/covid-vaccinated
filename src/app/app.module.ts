import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PatientDetailComponent } from './components/details/patient-detail/patient-detail.component';
import { PatientCareDetailComponent } from './components/details/patient-care-detail/patient-care-detail.component';
import { OrderDosePipe } from './pipes/order-dose.pipe';
import { VaccineDetailComponent } from './components/details/vaccine-detail/vaccine-detail.component';
import { LoginComponent } from './components/login/login.component';
import { DialogFullVaccineComponent } from './components/dialogs/dialog-full-vaccine/dialog-full-vaccine.component';
import { SharedModule } from './shared/shared.module';
import { PatientsModule } from './patients/patients.module';
import { VaccinesModule } from './vaccines/vaccines.module';
import { PatientCareModule } from './patient-care/patient-care.module';

@NgModule({
  declarations: [
    AppComponent,
    PatientDetailComponent,
    PatientCareDetailComponent,
    OrderDosePipe,
    VaccineDetailComponent,
    LoginComponent,
    DialogFullVaccineComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    PatientsModule,
    VaccinesModule,
    PatientCareModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
