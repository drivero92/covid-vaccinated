import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import {MatPaginator} from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { VaccineService } from 'src/app/services/vaccine.service'; 
import { Vaccine } from '../../models/vaccine';
import { DialogPatientsVaccinatedHistoryComponent } from '../dialogs/dialog-patients-vaccinated-history/dialog-patients-vaccinated-history.component';
import { DialogVaccineComponent } from '../dialogs/dialog-vaccine/dialog-vaccine.component';

@Component({
  selector: 'app-vaccines',
  templateUrl: './vaccines.component.html',
  styleUrls: ['./vaccines.component.css']
})
export class VaccinesComponent implements OnInit {

  vaccineTitle: string = "Vacunas";
  displayedColumns: string[] = ["Nombre", "Días de descanso", "Cantidad", "Dosis completa", "Acciones"];
  dataSource!: MatTableDataSource<any>;
  dataErrorMessage: string = '';
  vaccines: Vaccine [] = [];
  vaccineForm: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private vaccineService: VaccineService, 
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private vaccineDialog: MatDialog) 
  {
    this.vaccineForm = this.formBuilder.group(
      {
        vaccineName: ['', Validators.required],
        vaccineDays: ['', Validators.required],
        vaccineQuantity: ['', Validators.required],
        vaccineCompleteDose: ['', Validators.required],
      }
    )
  }

  ngOnInit(): void {
    this.getVaccines();
  }

  getVaccines() {
    this.vaccineService.getVaccines()
    .subscribe(
      {
        next:(res)=>{
          if (res) {
            this.vaccines = res;
            this.dataSource = new MatTableDataSource(res);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            localStorage.setItem('getVaccines', JSON.stringify(this.dataSource.data));
          } else {
            this.dataSource = new MatTableDataSource(res);
          }
        },
        error: (err) => {
          this.dataErrorMessage = err;
        }
      }
    );
  }
  removeVaccine(id: number) {
    const _res = confirm('Desea eliminar?');
    if (_res) {
      this.vaccineService.deleteVaccine(id).subscribe({
        next: (res) => {
          this.notificationMessage(res.message);
          this.vaccines.pop();
          this.getVaccines();
        }, 
        error: (err) => {
          this.notificationMessage(err);
        },
      });
    }
  }
  openVaccineDialog() {
    const dialogRef = this.vaccineDialog
      .open(DialogVaccineComponent, {
        width:'250px',
      })
      .afterClosed().subscribe( _value => {
        if (_value == 'save') {
          this.getVaccines();
        }
      });
  }
  editVaccine(element: any) {
    const dialogRef = this.vaccineDialog
      .open(DialogVaccineComponent, {
        width:'250px',
        data: element,
      })
      .afterClosed().subscribe( _value => {
        if (_value == 'update') {
          this.getVaccines();
        }
      });
  }
  viewPatientsVaccinated(element: any) {
    const dialogRef = this.vaccineDialog
      .open(DialogPatientsVaccinatedHistoryComponent, {
        width:'350px',
        maxHeight: '400px',
        data: element,
      });
  }
  /**
   * Filter the table with any value entered
   * @param event Event
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }    
  }
  /**
   * Method for throw a notification
   * @param message string
   */
   notificationMessage(message: string) {
    this._snackBar.open(message,undefined, {
        duration:3000,
        horizontalPosition:'center',
        verticalPosition:'top'
      });
  }

}
