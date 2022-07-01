import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

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
  }

  getPatient(id: number): Observable<Patient> {
    const url = `${this.urlPatients}/get/${id}`;
    return this.http.get<Patient>(url);
  }

  addPatient(patient: Patient): Observable<Patient> {
    const url = `${this.urlPatients}/save`;
      return this.http.post<Patient>(url, patient);
  }

  updatePatient(patient: Patient): Observable<Patient> {
    const url = `${this.urlPatients}/update`;
      return this.http.put<Patient>(url, patient);
  }

  deletePatient(id: number): Observable<Patient> {
    const url = `${this.urlPatients}/delete/${id}`;
    return this.http.delete<Patient>(url);
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
      //   `Backend returned code ${error.status}, body was: `, error.error);
        errorMessage = `${JSON.stringify(error.error.message)}`;
    }
    // Return an observable with a user-facing error message.
    //errorMessage+='Something bad happened; please try again later.';
    return throwError(() => new Error(errorMessage));
  }
}