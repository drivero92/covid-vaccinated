import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient';
import { DialogPatientComponent } from '../dialogs/dialog-patient/dialog-patient.component';
import { PatientCareService } from 'src/app/services/patient-care.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogVaccinationHistoryComponent } from '../dialogs/dialog-vaccination-history/dialog-vaccination-history.component';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {

  displayedColumns: string[] = ["Nombre", "Apellido", "CI", "Edad", "Acciones"];
  dataSource!: MatTableDataSource<any>;
  patient: Patient | undefined;
  patients: Patient [] = [];
  modeQuery: number;

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
    private patientCareService: PatientCareService,
    private formBuilder: FormBuilder, 
    private _snackBar: MatSnackBar,
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
      .subscribe(
        {
          next:(res)=>{
            this.patients = res;
            this.dataSource = new MatTableDataSource(res);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            localStorage.setItem('getPatients', JSON.stringify(this.dataSource.data));
          },
          error:(err)=>{
            //alert("Error de carga");
            this._snackBar.open(
              "Error de carga","Salir",
              {horizontalPosition:'center',verticalPosition:'top'});
          }
        }
      );
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

  detailsPatientVaccinated() {
    // const id = this.patientForm.value.id;
    // this.patientCareService.getPatientCareListByIdPatient(id).subscribe({
    //   next: (value) => {
    //     this.patient = this.patientForm.value.id;
    //   },
    // })
    //revisar patient detail para que no muestre las dos tablas de detalles del paciente
    // y tambien la lista de vacunas
    console.log(this.patientForm.value.name);
    this.patient = this.patientForm.value.id;
  }

  removePatient(id: number) {
    //revisar si esta intentando eliminar un paciente que ya se vacuno
    const _resp = confirm('Desea eliminar?');
    if (_resp) {
      this.patientService.deletePatient(id).subscribe({
          next: (res) => {
            //alert("Paciente eliminado");
            this._snackBar.open(
              "Paciente eliminado","",
              {duration:3000,horizontalPosition:'center',verticalPosition:'top'});
            this.getPatients();
          },
          error:() => {
            //alert("Error al eliminar");
            this._snackBar.open(
              "Error al eliminar","",
              {duration:3000,horizontalPosition:'center',verticalPosition:'top'});
          }
        });
    }
  }

  openPatientDialog() {
    const dialogRef = this.dialog.open(DialogPatientComponent, 
      {
        width:'250px',
      }).afterClosed().subscribe(val => {
        if(val == 'save') {
          this.getPatients();
        }
      });
  }

  editPatient(element: any) {
    const dialogRef = this.dialog.open(DialogPatientComponent, 
      {
        width:'250px',
        data: element,
      }).afterClosed().subscribe(val => {
        if(val == 'update') {
          this.getPatients();
        }
      });
  }

  viewPatientVaccinated(element: any) {
    const dialogRef = this.dialog.open(DialogVaccinationHistoryComponent, 
      {
        width:'450px',
        data: element,
      }).afterClosed().subscribe(val => {
        if(val == 'update') {
          this.getPatients();
        }
      });
  }

  /* Filter the table with any value entered */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
