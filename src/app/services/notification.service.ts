import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _snackBar: MatSnackBar) { }

  /**
   * Method for throw a notification
   * @param message string
   */
   notificationMessage(message: string, errorFlag?: boolean, highlight?: string) {
    let _type: string = '';
    if (errorFlag) {
      _type = 'mat-warn';
    } else {
      _type = 'custom-snackbar';
    }
    this._snackBar.open(message, highlight, {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['mat-toolbar', _type],
    });
  }
}
