import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PatientService } from 'src/app/patients/services/patient.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Patient } from 'src/app/models/patient';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-dialog-patient',
  templateUrl: './dialog-patient.component.html',
  styleUrls: ['./dialog-patient.component.css']
})
export class DialogPatientComponent implements OnInit {

  actionBtn: string = "Guardar";
  textRegEx = /^[a-zA-Z ]+$/;
  numberRegEx = /\-?\d*\.?\d{1,2}/;
  patientDialogForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.pattern(this.textRegEx)]],
    lastName: ['', [Validators.required, Validators.pattern(this.textRegEx)]],
    ci: ['', [Validators.required]],
    age: ['', [Validators.required, Validators.pattern(this.numberRegEx)]],
  });

  constructor(
    private patientService: PatientService,
    private formBuilder: FormBuilder,
    private notification: NotificationService,
    @Inject(MAT_DIALOG_DATA) public editData: Patient,
    private dialogRef: MatDialogRef<DialogPatientComponent>) { }

  ngOnInit(): void {
    this.putDataInForm();
    this.exitModalDialogByClick();
  }
  saveModal() {
    let _patient: Patient = this.patientDialogForm.value;
    if (!this.editData) {
      this.patientService.addPatient(_patient).subscribe({
        next: (res: any) => {
          this.notification.notificationMessage(res.message as string);
          this.patientDialogForm.reset();
          this.dialogRef.close('save');
        },
        error: (err) => {
          this.notification.notificationMessage(err,true);
        }
      });
    } else {
      this.updatePatient(_patient);
    }
  }
  /**
   * Method that comes from "saveModal()" for update a patient from the table
   * @param patient Patient
   */
  updatePatient(patient: Patient) {
    patient.id = this.editData.id;
    if (patient) {
      this.patientService.updatePatient(patient).subscribe({
        next: (res: any) => {
          this.notification.notificationMessage(res.message);
          this.patientDialogForm.reset();
          this.dialogRef.close('update');
        },
        error: (err) => {
          this.notification.notificationMessage(err,true);
        },
      });
    }
  }
  putDataInForm() {
    if (this.editData) {
      this.actionBtn = "Actualizar";
      this.patientDialogForm.controls['name'].setValue(this.editData.name);
      this.patientDialogForm.controls['lastName'].setValue(this.editData.lastName);
      this.patientDialogForm.controls['ci'].setValue(this.editData.ci);
      this.patientDialogForm.controls['age'].setValue(this.editData.age);
    }
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
