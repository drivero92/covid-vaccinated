import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private urlPatients = 'http://192.168.100.132:8080/patients';

  constructor(private http: HttpClient) { }

  getPatients(): Observable<Patient[]> {
    const url = `${this.urlPatients}/list`;
    return this.http.get<Patient[]>(url)
      .pipe(catchError(this.handleError));
  }

  getPatient(id: number): Observable<Patient> {
    const url = `${this.urlPatients}/${id}`;
    return this.http.get<Patient>(url)
      .pipe(catchError(this.handleError));
  }

  addPatient(patient: Patient): Observable<Patient> {
    const url = `${this.urlPatients}`;
    return this.http.post<Patient>(url, patient)
      .pipe(catchError(this.handleError));
  }

  updatePatient(patient: Patient): Observable<Patient> {
    const url = `${this.urlPatients}`;
    return this.http.put<Patient>(url, patient)
      .pipe(catchError(this.handleError));
  }

  deletePatient(id: number): Observable<any> {
    const url = `${this.urlPatients}/${id}`;
    return this.http.delete<any>(url)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
      errorMessage = 'A client-side or network error occurred';
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      // console.error(
      //   `Backend returned code ${error.status}, body was: `, error.error);
      errorMessage = `${JSON.stringify(error.error.message)}`;
    }
    // Return an observable with a user-facing error message.
    //errorMessage+='Something bad happened; please try again later.';
    return throwError(() => new Error(errorMessage));
  }
}