import { Component, Inject, ModuleWithComponentFactories, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {Observable} from 'rxjs';
import {startWith, map, debounceTime} from 'rxjs/operators';

import { PatientCareService } from 'src/app/services/patient-care.service';
import { PatientService } from 'src/app/services/patient.service';
import { VaccineService } from 'src/app/services/vaccine.service';
import { Patient } from 'src/app/models/patient';
import { Vaccine } from 'src/app/models/vaccine';
import { PatientCare } from 'src/app/models/patient-care';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-patient-care',
  templateUrl: './dialog-patient-care.component.html',
  styleUrls: ['./dialog-patient-care.component.css']
})
export class DialogPatientCareComponent implements OnInit {

  patients: Patient [] = [];
  patientCare: PatientCare | undefined;
  vaccines: Vaccine [] = [];
  doseDate: any;

  patientCareDialogForm = this.formBuilder.group({
    patient: ['', Validators.required],
    vaccine: ['', Validators.required],
    dose: ['', Validators.required],
    doseDate: ['', Validators.required],
  });

  filteredOptionsPatient!: Observable<Patient[]>;
  filteredOptionsVaccine!: Observable<Vaccine[]>;

  constructor(
    private patientCareService: PatientCareService, 
    private patientService: PatientService, 
    private vaccineService: VaccineService,
    private formBuilder: FormBuilder, 
    private _snackBar: MatSnackBar ,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogPatientCareComponent>) { }  

  ngOnInit(): void {
    
    this.getPatientsList();
    this.getVaccinesList();

    this.filteredOptionsPatient = this.patientCareDialogForm.controls['patient'].valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.name)),
      map(name => (name ? this._filterPatient(name) : this.patients.slice())),
    );
    this.filteredOptionsVaccine = this.patientCareDialogForm.controls['vaccine'].valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.name)),
      map(name => (name ? this._filterVaccine(name) : this.vaccines.slice())),
    );
    
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(_ => {
      let cn = confirm('Esta seguro de salir?')
      if (cn) {
        this.dialogRef.close();
      }
    });
    this.putDataToForm();
  }

  getPatientsList() {
    if(localStorage.getItem('getPatients') && '{}') {
      this.patients = JSON.parse(localStorage.getItem('getPatients') || '{}');
    } else {
      this.patientService.getPatients()
        .subscribe( patients => this.patients = patients);
    }
  }

  getVaccinesList() {
    if(localStorage.getItem('getVaccines') && '{}') {
      this.vaccines = JSON.parse(localStorage.getItem('getVaccines') || '{}');
    } else {     
      this.vaccineService.getVaccines()
      .subscribe( vaccines => this.vaccines = vaccines);
    }

  }

  putDataToForm() {
    let _patientCares: PatientCare [] = [];
    let _patientCare: PatientCare | undefined;
    this.patientCareDialogForm.controls['patient'].valueChanges
      .pipe(debounceTime(1000))
      .subscribe(
        {
          next: (res) =>{
            const name = this.patientCareDialogForm.value.patient?.name;
            if (localStorage.getItem('getPatientCares')?.search(name)) {
              _patientCares = JSON.parse(localStorage.getItem('getPatientCares') || '{}');
              _patientCare = _patientCares.find(pc => pc.patient.id === this.patientCareDialogForm.value.patient.id);
              this.patientCareService.getLastPatientCareByIdPatient(_patientCare?.patient.id || 0)
                .subscribe(pc => {
                  this.doseDate = this.patientCare?.doseDate;
                  if (pc.completeDose) {
                    if (pc?.vaccine.name == 'Sputnik') {
                      this.patientCareDialogForm.controls['vaccine'].setValue('AstraZeneca');
                    } else if (pc?.vaccine.name == 'AstraZeneca') {
                      this.patientCareDialogForm.controls['vaccine'].setValue('Moderna');
                    } else if (pc?.vaccine.name == 'Sinopharm') {
                      this.patientCareDialogForm.controls['vaccine'].setValue('Pfizer');
                    } 
                    this.patientCareDialogForm.controls['dose'].setValue(1);
                  } else {
                    this.patientCareDialogForm.controls['vaccine'].setValue(pc?.vaccine.name);
                    this.patientCareDialogForm.controls['dose'].setValue((pc?.dose ?? 0) + 1);
                  }                  
                  this.patientCare = pc
          });
        }
      }
    });
  }

  saveModal(){
    const doseDateFormatter = new Date(this.patientCareDialogForm.value.doseDate);
    let _doseDate = new Date();
    let _lastDoseDate = new Date();
    let _d: string;
    const combinedForms: any = {
      idPatient: this.patientCareDialogForm.value.patient.id,
      idVaccine: this.patientCareDialogForm.value.vaccine.id,
      dose: this.patientCareDialogForm.value.dose,
      doseDate: doseDateFormatter.toISOString().split("T")[0],
    };
    this.patientCareService.addPatientCare(combinedForms).subscribe(
      {
        next: (res) => {
          if(this.patientCare?.doseDate != null) {
            _lastDoseDate = new Date(this.patientCare.doseDate);
          } else {
            _lastDoseDate = doseDateFormatter;
          }
          _doseDate.setMonth(_lastDoseDate.getMonth());
          _doseDate.setFullYear(_lastDoseDate.getFullYear());
          _doseDate.setDate(_lastDoseDate.getDate()+this.patientCareDialogForm.value.vaccine.days);
          doseDateFormatter.setDate(doseDateFormatter.getDate()+this.patientCareDialogForm.value.vaccine.days);
          if(doseDateFormatter.valueOf() >= _doseDate.valueOf() || this.patientCareDialogForm.value.dose < this.patientCareDialogForm.value.vaccine.completeDose) {
                        
            if(this.patientCareDialogForm.value.dose < this.patientCareDialogForm.value.vaccine.completeDose && !this.patientCare?.completeDose) {
              this._snackBar.open("Paciente añadido con exito, debe retornar posterior a la fecha: ", 
                doseDateFormatter.toISOString().split("T")[0],
                { duration:5000, horizontalPosition:'center', verticalPosition:'top'});
            } else {
              this._snackBar.open("Paciente añadido con exito, dosis completa","",
                { duration:3000, horizontalPosition:'center', verticalPosition:'top'});
            }
            if (this.patientCare) {
              if (this.patientCare.completeDose && this.patientCareDialogForm.value.dose==1) {
                this._snackBar.open("Dosis de refuerzo completa","",
                  { duration:5000, horizontalPosition:'center', verticalPosition:'top'});            
              }
            }
            this.patientCareDialogForm.reset();
            this.dialogRef.close('save');
          } else {
            this._snackBar.open("El paciente no se ha añadido, necesita pasar los dias de descanso, debe volver el: ",
              _doseDate.toISOString().split("T")[0],
              {
                duration:3000,
                horizontalPosition:'center', 
                verticalPosition:'top'
              });
          }
        },
        error: (error) => {
          this._snackBar.open(error,"",
          { duration:3000, horizontalPosition:'center', verticalPosition:'top'});
        }
      }
    );
  }

  openPatientCareExitNotification() {
    this._snackBar.open("Registrado", "",{duration:1000});
  }

  displayFnPatient(patient: Patient): string {
    return patient && patient.name ? patient.name : '';
  }
  displayFnVaccine(vaccine: Vaccine): string {
    return vaccine && vaccine.name ? vaccine.name : '';
  }

  private _filterPatient(name: string): Patient[] {
    const filterValue = name.toLowerCase();

    return this.patients.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  private _filterVaccine(name: string): Vaccine[] {
    const filterValue = name.toLowerCase();

    return this.vaccines.filter(option => option.name.toLowerCase().includes(filterValue));
  }

}
