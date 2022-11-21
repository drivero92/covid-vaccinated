import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogPatientCareComponent } from '../dialog-patient-care/dialog-patient-care.component';
import { Observable } from 'rxjs';
import {startWith, map, debounceTime} from 'rxjs/operators';

import { PatientCare } from 'src/app/models/patient-care';
import { PatientCareService } from 'src/app/patient-care/services/patient-care.service';
import { Patient } from 'src/app/models/patient';
import { PatientService } from 'src/app/patients/services/patient.service';
import { Vaccine } from 'src/app/models/vaccine';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-patient-care',
  templateUrl: './patient-care.component.html',
  styleUrls: ['./patient-care.component.css']
})
export class PatientCareComponent implements OnInit {

  displayedColumns: string[] = ["Paciente", "Vacuna", "N° dosis", "Fecha de vacunación", "Acciones"];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  patientCareTitle: string = "Pacientes vacunados";
  patientCares: PatientCare [] = [];
  patientList: Patient [] = [];
  vaccines: Vaccine[] = [];
  doses: number[] = [];
  vaccineName = 'name';
  dose:number | undefined = undefined;
  noneFilerVaccine: any;
  dataErrorMessage: string = '';
  filterForm: FormGroup;

  constructor(
    private patientCareService: PatientCareService, 
    private patientService: PatientService,
    private formBuilder: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService,
    private dialog: MatDialog)
    {
        
      this.filterForm = this.formBuilder.group({
        vaccine: this.vaccineName,//The value is the same as I receive in the vaccine format.
        dose: this.dose,
      });
      
    }

  ngOnInit(): void {
    this.getPatientCares();
    this.getVaccineListFromPatientCareList();
    this.getDoseListFromPatientCareList();
    this.filterVaccine(); 
  }
  /**
   * Fetches the list of patient cares vaccinated
   */
  getPatientCares() {
    this.patientCareService.getPatientCares().subscribe({
      next: (res) => {
          if (res) {
            this.patientCares = res;
            this.dataSource = new MatTableDataSource(res);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            localStorage.setItem('getPatientCares',JSON.stringify(this.dataSource.data));
          } else {
            this.dataSource = new MatTableDataSource(res);
          }
        },
        error: (err) => {
          this.dataErrorMessage = err;
        }
      });
  }
  /**
   * Method for obtaining the vaccines that were used in the patients and is used in the DOM "vaccines"
   */
  getVaccineListFromPatientCareList() {
    if (localStorage.getItem('getPatientCares') && '{}') {
      this.patientCares = JSON.parse(localStorage.getItem('getPatientCares') || '{}');
    }
    if (this.patientCares) {
      let _vaccineList = this.patientCares
        .map(_patientCare => _patientCare.vaccine)
      const ids = _vaccineList.map(o => o.id)
      this.vaccines = _vaccineList.filter(({id}, index) => !ids.includes(id, index + 1));
    }    
  }
  getDoseListFromPatientCareList() {
    if (localStorage.getItem('getPatientCares') && '{}') {
      this.patientCares = JSON.parse(localStorage.getItem('getPatientCares') || '{}');
    }
    if (this.patientCares) {
      let _vaccineList = this.patientCares
        .map(_patientCare => _patientCare.dose)
      const ids = _vaccineList.map(o => o.valueOf())
      this.doses = _vaccineList.filter((id: number, index) => !ids.includes(id, index + 1));
    }    
  }
  /**
   * Filter the vaccine from the patient care table
   */
  filterVaccine() {
    this.route.queryParamMap.subscribe(params =>{
      this.vaccineName = params.get('vaccine') || 'name';
      this.dose = Number(params.get('dose'));
    });

    this.filterForm.valueChanges.subscribe((res) => {
      this.router.navigate(['/'], {queryParams: {values: JSON.stringify(res.vaccine?.name || res?.dose)}});
      this.getFilteredData(res);
    });
  }
  getFilteredData(value: any) {
    if (this.filterForm.value.vaccine?.id) {
      this.patientCareService.getPatientCareListByVaccineId(value.vaccine.id).subscribe(
        res => {
          if (res) {
            this.dataSource = new MatTableDataSource(res);
          }
        });
    } else if (this.filterForm.value.dose) {
      this.patientCareService.getPatientCareListByDose(value.dose).subscribe(
        res => {
          if (res) {
            this.dataSource = new MatTableDataSource(res);
          }
        });
    } else {
        this.patientCareService.getPatientCares().subscribe(
        res => {
          if (res) {
            this.dataSource = new MatTableDataSource(res);
          }            
        });
    }
  }
  /**
   * Deletes a patient care by id
   * @param id number
   */
  removePatientCare(id: number) {
    const _res = confirm('Desea eliminar?');
    if (_res) {
      this.patientCareService.deletePatientCare(id).subscribe({
          next: (res) => {
            this.notification.notificationMessage(res.message);
            this.patientCares.pop();
            this.getPatientCares();
          },
          error: (err) => {
            this.notification.notificationMessage(err,true);
          }
        });
    }
  }
  openPatientCareDialog() {
    const dialogRef = this.dialog
      .open(DialogPatientCareComponent, {
        width:'250px',
      })
      .afterClosed().subscribe(value => {
        if(value == 'save') {
          this.getPatientCares();
        }
      });
  }
}
