import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { FullVaccine } from '../models/full-vaccine';
import { Vaccine } from '../models/vaccine';

@Injectable({
  providedIn: 'root'
})
export class FullVaccineService {

  private urlFullVaccine = 'http://192.168.100.132:8080/full_vaccines';

  constructor(private http: HttpClient) { }

  getFullVaccines(): Observable<FullVaccine[]> {
    const url = `${this.urlFullVaccine}/list`;
    return this.http.get<FullVaccine[]>(url)
      .pipe(catchError(this.handleError));
  }

  getVaccineList(id: number): Observable<Vaccine[]> {
    const url = `${this.urlFullVaccine}/${id}/vaccines`;
    return this.http.get<Vaccine[]>(url)
      .pipe(catchError(this.handleError));
  }

  addFullVaccine(fullVaccine: any): Observable<FullVaccine> {
    const url = `${this.urlFullVaccine}`;
    return this.http.post<FullVaccine>(url, fullVaccine)
      .pipe(catchError(this.handleError));
  }

  updateFullVaccine(fullVaccine: FullVaccine): Observable<FullVaccine> {
    const url = `${this.urlFullVaccine}`;
    return this.http.put<FullVaccine>(url, fullVaccine)
      .pipe(catchError(this.handleError));
  }

  deleteFullVaccine(id: number): Observable<any> {
    const url = `${this.urlFullVaccine}/${id}`;
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
