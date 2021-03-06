import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogPatientCareComponent } from '../dialogs/dialog-patient-care/dialog-patient-care.component';
import { Observable } from 'rxjs';
import {startWith, map, debounceTime} from 'rxjs/operators';

import { PatientCare } from 'src/app/models/patient-care';
import { PatientCareService } from 'src/app/services/patient-care.service';
import { Patient } from 'src/app/models/patient';
import { PatientService } from 'src/app/services/patient.service';
import { Vaccine } from 'src/app/models/vaccine';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  patientCares: PatientCare [] = [];
  patientList: Patient [] = [];
  patient: Patient | undefined;
  vaccines: Vaccine[] = [];
  vaccineName = 'name';
  dose:number = 0;
  nu:number = 0;
  noneFilerVaccine: any;

  patientCareForm: FormGroup;
  filterForm: FormGroup;

  filteredOptionsPatient!: Observable<Patient[]>;

  constructor(
    private patientCareService: PatientCareService, 
    private patientService: PatientService,
    private formBuilder: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog)
    {
      this.patientCareForm = this.formBuilder.group(
        {
          patient: ['', Validators.required],
          /* vaccine: ['', Validators.required],
          dose: ['', Validators.required],
          doseDate: ['', Validators.required], */
        });
        
      this.filterForm = this.formBuilder.group({
        vaccine: this.vaccineName,//The value is the same as I receive in the vaccine format.
        dose: this.dose,
      });
      
    }

  ngOnInit(): void {
    this.getPatientCares();
    this.getPatientCare();
    this.getPatientsList();
    this.getVaccineListFromPatientCareList();
    this.filterVaccine();

    this.filteredOptionsPatient = this.patientCareForm.controls['patient'].valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.name)),
      map(name => (name ? this._filterPatient(name) : this.patientList.slice())),
    );
  }
  /**
   * Fetches the list of patient cares vaccinated
   */
  getPatientCares() {
    this.patientCareService.getPatientCares()
      .subscribe(
        {
          next: (res) => {
            this.dataSource = new MatTableDataSource(res);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            localStorage.setItem('getPatientCares',JSON.stringify(this.dataSource.data));
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
  /**
   * Method for get the patient care detail of a patient vaccinated
   */
  getPatientCare() {
    this.patientCareForm.controls['patient'].valueChanges
      .subscribe(
        {
          next: (res) => {
            const name = this.patientCareForm.value.patient?.name;
            if(localStorage.getItem('getPatientCares')?.search(name)) 
            {
              this.patient = this.patientCareForm.value.patient;
            }
          }
      });
  }
  /**
   * Method for get the patient list in Autocomplete component HTML
   */
  getPatientsList() {
    if(localStorage.getItem('getPatients') && '{}') {
      this.patientList = JSON.parse(localStorage.getItem('getPatients') || '{}');
    } else {
      this.patientService.getPatients()
        .subscribe( patients => this.patientList = patients);
    }
  }
  /**
   * Method for obtaining the vaccines that were used in the patients
   */
  getVaccineListFromPatientCareList() {
    if(localStorage.getItem('getPatientCares') && '{}') {
      this.patientCares = JSON.parse(localStorage.getItem('getPatientCares') || '{}');
    }
    
    let _vaccineList = this.patientCares
        .map(_patientCare => _patientCare.vaccine)
    const ids = _vaccineList.map(o => o.id)
    this.vaccines = _vaccineList.filter(({id}, index) => !ids.includes(id, index + 1))
  }
  /**
   * Filter the vaccine from the patient care table
   */
  filterVaccine() {
    this.route.queryParamMap.subscribe(params =>{
      this.vaccineName = params.get('vaccine') || 'name'
      this.dose = Number(params.get('dose')) || 0
    });
    this.filterForm.valueChanges.subscribe(() => {
      this.router.navigate(['/'], {queryParams: {values: JSON.stringify(this.filterForm.value.vaccine?.name)}})
      if(this.filterForm.value.vaccine?.id) {
        this.patientCareService.getPatientCareListByIdVaccine(this.filterForm.value.vaccine?.id).subscribe(
          res => {
            this.dataSource = new MatTableDataSource(res);            
          });
      } else if(this.filterForm.value.dose?.dose) {
        this.patientCareService.getPatientCareListByDose(this.filterForm.value.dose?.dose).subscribe(
          resp => {
            this.dataSource = new MatTableDataSource(resp);            
          });
      } else {
          this.patientCareService.getPatientCares().subscribe(
          resp => {
            this.dataSource = new MatTableDataSource(resp);              
          });
      }
      
    });
  }
  /**
   * Deletes a patient care by id
   * @param id number
   */
  removePatientCare(id: number) {
    const _resp = confirm('Desea eliminar?');
    if (_resp) {
      this.patientCareService.deletePatientCare(id).subscribe({
          next: (res) => {
            //alert("Paciente vacunado eliminado");
            this._snackBar.open(
              "Paciente eliminado","",
              {duration:3000,horizontalPosition:'center',verticalPosition:'top'});
            this.getPatientCares();
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

  openPatientCareDialog() {
    const dialogRef = this.dialog.open(DialogPatientCareComponent, 
      {
        width:'250px',
      }).afterClosed().subscribe(val => {
        if(val == 'save') {
          this.getPatientCares();
        }
      });
  }

  displayFnPatient(patient: Patient): string {
    return patient && patient.name ? patient.name : '';
  }
  /**
   * Filters the registered patient form to see the vaccination history
   * @param name string
   * @returns 
   */
  private _filterPatient(name: string): Patient[] {
    const filterValue = name.toLowerCase();
    return this.patientList.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  /**
   * Filter the table with any value entered
   * @param event Event
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
