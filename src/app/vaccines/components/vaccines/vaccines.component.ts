import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import {MatPaginator} from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { FullVaccineService } from 'src/app/vaccines/services/full-vaccine.service';
import { NotificationService } from 'src/app/services/notification.service';

import { VaccineService } from 'src/app/vaccines/services/vaccine.service'; 
import { Vaccine } from '../../../models/vaccine';
import { DialogCompatibleVaccinesComponent } from '../dialog-compatible-vaccines/dialog-compatible-vaccines.component';
import { DialogPatientsVaccinatedHistoryComponent } from '../dialog-patients-vaccinated-history/dialog-patients-vaccinated-history.component';
import { DialogVaccineComponent } from '../dialog-vaccine/dialog-vaccine.component';

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
    private fullVaccineService: FullVaccineService,
    private formBuilder: FormBuilder,
    private notification: NotificationService,
    private vaccineDialog: MatDialog,
    private fullVaccineDialog: MatDialog,) 
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
    this.vaccineService.getVaccines().subscribe({
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
      this.fullVaccineService.deleteFullVaccine(id).subscribe({
        next: (res) => {
          this.notification.notificationMessage(res.message);
          this.vaccines.pop();
          this.getVaccines();
        }, 
        error: (err) => {
          this.notification.notificationMessage(err,true);
        },
      });
    }
  }
  openVaccineDialog() {
    const dialogRef = this.vaccineDialog
      .open(DialogVaccineComponent, {
        width:'250px',
      })
      .afterClosed().subscribe(value => {
        if (value == 'save') {
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
      .afterClosed().subscribe(value => {
        if (value == 'update') {
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
  viewCompatibleVaccines(element: any) {
    const dialogRef = this.fullVaccineDialog
      .open(DialogCompatibleVaccinesComponent, {
        width: '400px',
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
}
