import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { Vaccine } from '../models/vaccine';

@Injectable({
  providedIn: 'root'
})
export class VaccineService {

  private urlVaccines = 'http://192.168.100.132:8080/vaccines';

  constructor(private http: HttpClient) { }

  getVaccines(): Observable<Vaccine[]> {
    const url = `${this.urlVaccines}/list`;
    return this.http.get<Vaccine[]>(url)
      .pipe(catchError(this.handleError));
  }

  getVaccine(id: number): Observable<Vaccine> {
    const url = `${this.urlVaccines}/get/${id}`;
    return this.http.get<Vaccine>(url)
      .pipe(catchError(this.handleError));
  }

  addVaccine(Vaccine: Vaccine): Observable<Vaccine> {
    const url = `${this.urlVaccines}/save`;
      return this.http.post<Vaccine>(url, Vaccine)
        .pipe(catchError(this.handleError));
  }

  updateVaccine(Vaccine: Vaccine): Observable<Vaccine> {
    const url = `${this.urlVaccines}/update`;
      return this.http.put<Vaccine>(url, Vaccine)
        .pipe(catchError(this.handleError));
  }

  deleteVaccine(id: number): Observable<any> {
    const url = `${this.urlVaccines}/delete/${id}`;
    return this.http.delete<any>(url)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage='';
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
