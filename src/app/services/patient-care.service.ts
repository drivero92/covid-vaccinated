import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PatientCare } from '../models/patient-care';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientCareService {

  private urlPatientCare = 'http://192.168.100.132:8080/patient_cares';

  constructor(private http: HttpClient) {}  

  getPatientCares(): Observable<PatientCare[]> {
    const url = `${this.urlPatientCare}/list`;
    return this.http.get<PatientCare[]>(url)
  }

  getPatientCareListByIdPatient(id: number): Observable<PatientCare[]> {
    const url = `${this.urlPatientCare}/list_patient_care/${id}`;
    return this.http.get<PatientCare[]>(url)
  }

  getLastPatientCareByIdPatient(id: number): Observable<PatientCare> {
    const url = `${this.urlPatientCare}/get/last_patient_care_byPatientId/${id}`;
    return this.http.get<PatientCare>(url)
  }

  getPatientCareListByIdVaccine(id: number): Observable<PatientCare[]> {
    const url = `${this.urlPatientCare}/list_vaccines_patient_care/${id}`;
    return this.http.get<PatientCare[]>(url)
  }

  getPatientCareListByDose(dose: number): Observable<PatientCare[]> {
    const url = `${this.urlPatientCare}/list_vaccines_patient_care_byDose/${dose}`;
    return this.http.get<PatientCare[]>(url)
  }

  addPatientCare(patientCare: any): Observable<PatientCare> {
    const url = `${this.urlPatientCare}/save`;
    return this.http.post<PatientCare>(url, patientCare)
      .pipe(catchError(this.handleError));
  }

  updatePatientCare(patientCare: any): Observable<PatientCare> {
    const url = `${this.urlPatientCare}/update`;
    return this.http.put<PatientCare>(url, patientCare)
      .pipe(catchError(this.handleError));
  }

  deletePatientCare(id: number): Observable<PatientCare> {
    const url = `${this.urlPatientCare}/delete/${id}`;
    return this.http.delete<PatientCare>(url);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage='';
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      // console.error(
      //   `Backend returned code ${error.status}, body wasSA: `, error.error);
        // errorMessage = `Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}` ;
        errorMessage = `${JSON.stringify(error.error.message)}`;
    }
    // Return an observable with a user-facing error message.
    //errorMessage+='Something bad happened; please try again later.';
    return throwError(() => new Error(errorMessage));
  }
}
