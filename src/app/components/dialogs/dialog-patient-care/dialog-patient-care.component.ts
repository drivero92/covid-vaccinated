import { Component, HostListener, Inject, ModuleWithComponentFactories, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, Form } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';

import { PatientCareService } from 'src/app/services/patient-care.service';
import { PatientService } from 'src/app/services/patient.service';
import { VaccineService } from 'src/app/services/vaccine.service';
import { Patient } from 'src/app/models/patient';
import { Vaccine } from 'src/app/models/vaccine';
import { PatientCare } from 'src/app/models/patient-care';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-dialog-patient-care',
  templateUrl: './dialog-patient-care.component.html',
  styleUrls: ['./dialog-patient-care.component.css']
})
export class DialogPatientCareComponent implements OnInit {

  patients: Patient[] = [];
  patientCare: PatientCare | undefined;
  vaccines: Vaccine[] = [];
  doseDateFormatter: any;

  numberRegEx = /\b([1-9]|10)\b/;
  patientCareDialogForm = this.formBuilder.group({
    patient: ['', Validators.required],
    vaccine: ['', Validators.required],
    dose: ['', [Validators.required, Validators.pattern(this.numberRegEx)]],
    doseDate: ['', Validators.required],
  });

  filteredOptionsPatient!: Observable<Patient[]>;
  filteredOptionsVaccine!: Observable<Vaccine[]>;

  constructor(
    private patientCareService: PatientCareService,
    private patientService: PatientService,
    private vaccineService: VaccineService,
    private formBuilder: FormBuilder,
    private notification: NotificationService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogPatientCareComponent>) { }

  ngOnInit(): void {
    this.getPatientsList();
    this.getVaccinesList();
    this.putDataAddForm();
    this.filteredOptionsPatients();
    this.filteredOptionsVaccines();
    this.exitModalDialogByClick();
  }
  getPatientsList() {
    if (localStorage.getItem('getPatients') && '{}') {
      this.patients = JSON.parse(localStorage.getItem('getPatients') || '{}');
    } else {
      this.patientService.getPatients()
        .subscribe(patients => this.patients = patients);
    }
  }
  getVaccinesList() {
    if (localStorage.getItem('getVaccines') && '{}') {
      this.vaccines = JSON.parse(localStorage.getItem('getVaccines') || '{}');
    } else {
      this.vaccineService.getVaccines()
        .subscribe(vaccines => this.vaccines = vaccines);
    }
  }
  putDataAddForm() {
    this.patientCareDialogForm.controls['patient'].valueChanges
      .pipe(debounceTime(1000))
      .subscribe({
        next: () => {
          this.dataInAddForm();
        }
      });
  }
  dataInAddForm() {
    let _patientCares: PatientCare[] = [];
    let _patientCare: PatientCare | undefined;
    const name = this.patientCareDialogForm.value.patient?.name;
          if (localStorage.getItem('getPatientCares')?.search(name)) {
            _patientCares = JSON.parse(localStorage.getItem('getPatientCares') || '{}');
            if (_patientCares) {
              _patientCare = _patientCares.find(pc => pc.patient?.id === this.patientCareDialogForm?.value.patient?.id);
            }

            this.patientCareService.getLastPatientCareByPatientId(_patientCare?.patient.id || 0)
              .subscribe(pc => {
                //this.doseDate = this.patientCare?.doseDate;
                if (pc) {
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
                }
              });
          }
  }
  getPatientCareDialogForm(): Form {
    this.doseDateFormatter = new Date(this.patientCareDialogForm.value.doseDate);
    const combinedFields: any = {
      patientId: this.patientCareDialogForm.value.patient.id,
      vaccineId: this.patientCareDialogForm.value.vaccine.id,
      dose: this.patientCareDialogForm.value.dose,
      doseDate: this.doseDateFormatter.toISOString().split("T")[0],
    };
    return combinedFields;
  }  
  saveModal() {
    const _res = this.getPatientCareDialogForm();
    this.patientCareService.addPatientCare(_res).subscribe(
      {
        next: () => {
          this.successMessages();
          this.patientCareDialogForm.reset();
          this.dialogRef.close('save');
        },
        error: (err) => {
          this.notification.notificationMessage(err, true);
        }
      }
    );
  }
  successMessages() {
    let _message: string = '';
    const _nextDoseDate = new Date();
    _nextDoseDate.setMonth(this.doseDateFormatter.getMonth());
    _nextDoseDate.setFullYear(this.doseDateFormatter.getFullYear());
    _nextDoseDate.setDate(this.doseDateFormatter.getDate() + this.patientCareDialogForm.value.vaccine.restDays);

    if (this.patientCareDialogForm.value.dose < this.patientCareDialogForm.value.vaccine.completeDose
      && !this.patientCare?.completeDose) {
      _message = "Patient added successfully, must return after the date: ";
      this.notification.notificationMessage(_message, false, _nextDoseDate.toISOString().split("T")[0]);
    } else {
      //lanzar notificacion de "fecha de regreso para refuerzo"  despues de cumplir la dosis completa
      //saber si solo se necesita una dosis de refuerzo
      if (this.patientCare?.completeDose && this.patientCareDialogForm.value.dose == 1) {
        _message = "Complete booster dose";
        this.notification.notificationMessage(_message);
      } else {
        _message = "Patient successfully added, dose completed";
        this.notification.notificationMessage(_message);
      }
    }
  }
  /**
   * Filters the registered patient form to see the vaccination history
   * @param name string
   * @returns 
   */
  filteredOptionsPatients() {
    this.filteredOptionsPatient = this.patientCareDialogForm.controls['patient'].valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.name)),
      map(name => (name ? this._filterPatient(name) : this.patients.slice())),
    );
  }
  filteredOptionsVaccines() {
    this.filteredOptionsVaccine = this.patientCareDialogForm.controls['vaccine'].valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.name)),
      map(name => (name ? this._filterVaccine(name) : this.vaccines.slice())),
    );
  }
  private _filterPatient(name: string): Patient[] {
    const filterValue = name.toLowerCase();
    return this.patients.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  private _filterVaccine(name: string): Vaccine[] {
    const filterValue = name.toLowerCase();
    return this.vaccines.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  displayFnPatient(patient: Patient): string {
    return patient && patient.name ? patient.name : '';
  }
  displayFnVaccine(vaccine: Vaccine): string {
    return vaccine && vaccine.name ? vaccine.name : '';
  }
  exitModalDialogByClick() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(_ => {
      let cn = confirm('Esta seguro de salir?')
      if (cn) {
        this.dialogRef.close();
      }
    });
  }
  @HostListener('window:keyup.esc') onKeyUp() {
   let cn = confirm('Esta seguro de salir?')
   if (cn) {
     this.dialogRef.close();
   }
 }
 @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
   console.log('event:', event);
   event.returnValue = false;
 }
}
