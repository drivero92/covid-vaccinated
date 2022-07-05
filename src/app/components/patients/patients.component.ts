import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient';
import { DialogPatientComponent } from '../dialogs/dialog-patient/dialog-patient.component';
import { DialogVaccinationHistoryComponent } from '../dialogs/dialog-vaccination-history/dialog-vaccination-history.component';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {

  patientsTitle: string = "Pacientes";
  displayedColumns: string[] = ["Nombre", "Apellido", "CI", "Edad", "Acciones"];
  dataSource!: MatTableDataSource<any>;
  patients: Patient [] = [];
  modeQuery: number;
  dataErrorMessage: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  patientForm: FormGroup = this.formBuilder.group({
      patientName: ['', Validators.required],
      patientLastName: ['', Validators.required],
      patientCI: ['', Validators.required],
      patientAge: ['', Validators.required],
    });

  constructor(
    private patientService: PatientService,
    private formBuilder: FormBuilder, 
    private notification: NotificationService,
    private dialog: MatDialog) 
  { 
    this.modeQuery = 0;
  }

  ngOnInit(): void {
    this.getPatients();
  }
  /* Get a list of patients registered
  We need be careful with dataSource, 
  it should be match displayedColumns 
  with the matColumnDef="<the same name>" */
  getPatients(): void {
    this.patientService.getPatients()
      .subscribe({
          next: (res) => {
            if (res) {
              this.patients = res;
              this.dataSource = new MatTableDataSource(res);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              localStorage.setItem('getPatients', JSON.stringify(this.dataSource.data));
            } else {
              this.dataSource = new MatTableDataSource(res);
            }
          }, 
          error: (err) => {
            this.dataErrorMessage = err;
          }
        });
  }
  postPatient(): void {    
    const p: any = {
      name: this.patientForm.value.patientName,
      lastName: this.patientForm.value.patientLastName,
      ci: this.patientForm.value.patientCI,
      age: this.patientForm.value.patientAge,
    }
    this.patientService.addPatient(p).subscribe(patient => {
      this.patients.push(patient);
    });
    this.getPatients();
  }  
  removePatient(id: number) {
    //revisar si esta intentando eliminar un paciente que ya se vacuno
    const _res = confirm('Desea eliminar?');
    if (_res) {
      this.patientService.deletePatient(id).subscribe({
          next: (res) => {
            this.notification.notificationMessage(res.message as string);
            this.patients.pop();
            this.getPatients();
          },
          error: (err) => {
            this.notification.notificationMessage(err,true);
          }
        });
    }
  }
  openPatientDialog() {
    const dialogRef = this.dialog
      .open(DialogPatientComponent, {
        width:'250px',
      })
      .afterClosed().subscribe(val => {
        if(val == 'save') {
          this.getPatients();
        }
      });
  }
  editPatient(element: any) {
    const dialogRef = this.dialog
      .open(DialogPatientComponent, {
        width:'250px',
        data: element,
      })
      .afterClosed().subscribe(val => {
        if(val == 'update') {
          this.getPatients();
        }
      });
  }
  viewPatientVaccinated(element: any) {
    const dialogRef = this.dialog
      .open(DialogVaccinationHistoryComponent, {
        width:'450px',
        data: element,
      });
  }
  /**
   * Filter the table with any value entered
   * @param event Event
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

}
