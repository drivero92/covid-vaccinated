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
      .pipe(catchError(this.handleError));
  }

  getPatientCareListByPatientId(id: number): Observable<PatientCare[]> {
    const url = `${this.urlPatientCare}/${id}`;
    return this.http.get<PatientCare[]>(url)
      .pipe(catchError(this.handleError));
  }

  getLastPatientCareByPatientId(id: number): Observable<PatientCare> {
    const url = `${this.urlPatientCare}/${id}/last_patient_care`;
    return this.http.get<PatientCare>(url)
      .pipe(catchError(this.handleError));
  }

  getPatientCareListByVaccineId(id: number): Observable<PatientCare[]> {
    const url = `${this.urlPatientCare}/${id}/list_vaccines`;
    return this.http.get<PatientCare[]>(url)
      .pipe(catchError(this.handleError));
  }

  getPatientCareListByDose(dose: number): Observable<PatientCare[]> {
    const url = `${this.urlPatientCare}/${dose}/list_vaccines_dose`;
    return this.http.get<PatientCare[]>(url)
      .pipe(catchError(this.handleError));
  }

  addPatientCare(patientCare: any): Observable<PatientCare> {
    const url = `${this.urlPatientCare}`;
    return this.http.post<PatientCare>(url, patientCare)
      .pipe(catchError(this.handleError));
  }

  updatePatientCare(patientCare: any): Observable<PatientCare> {
    const url = `${this.urlPatientCare}`;
    return this.http.put<PatientCare>(url, patientCare)
      .pipe(catchError(this.handleError));
  }

  deletePatientCare(id: number): Observable<any> {
    const url = `${this.urlPatientCare}/${id}`;
    return this.http.delete<any>(url)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage='';
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
      errorMessage ='A client-side or network error occurred.';
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
        // errorMessage += `Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}` ;
        errorMessage = `${JSON.stringify(error.error.message)}`;
    }
    // Return an observable with a user-facing error message.
    // errorMessage+='Something bad happened; please try again later.';
    return throwError(() => new Error(errorMessage));
  }
}
