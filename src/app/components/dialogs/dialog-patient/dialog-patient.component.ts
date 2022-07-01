import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PatientService } from 'src/app/services/patient.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Patient } from 'src/app/models/patient';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-patient',
  templateUrl: './dialog-patient.component.html',
  styleUrls: ['./dialog-patient.component.css']
})
export class DialogPatientComponent implements OnInit {
  
  actionBtn: string = "Guardar";
  textRegEx = /^[a-zA-Z ]+$/;
  numberRegEx = /\-?\d*\.?\d{1,2}/;  
  patientForm: FormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(this.textRegEx)]],
      lastName: ['', [Validators.required,Validators.pattern(this.textRegEx)]],
      ci: ['', [Validators.required, Validators.pattern(this.numberRegEx)]],
      age: ['', [Validators.required, Validators.pattern(this.numberRegEx)]],
    });

  constructor(
    private patientService: PatientService, 
    private formBuilder: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public editData: Patient,
    private dialogRef: MatDialogRef<DialogPatientComponent>,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.patientForm;
    if (this.editData) {
      this.actionBtn = "Actualizar";
      this.patientForm.controls['name'].setValue(this.editData.name);
      this.patientForm.controls['lastName'].setValue(this.editData.lastName);
      this.patientForm.controls['ci'].setValue(this.editData.ci);
      this.patientForm.controls['age'].setValue(this.editData.age);
    }

    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(_ => {
      let cn = confirm('Esta seguro de salir?')
      if (cn) {
        this.dialogRef.close();
      }
    });
  }

  saveModal(){
    let patients: Patient[] =[];
    let _patient: Patient = this.patientForm.value;
    /* if(localStorage.getItem('patientsLS') != null) {
      patients = JSON.parse(localStorage.getItem('patientsLS') || '{}'); 
    } */
    //patients.push(patient);
    //localStorage.setItem('patientsLS',JSON.stringify(patients));

    if (!this.editData) {
      this.patientService.addPatient(_patient).subscribe(
        {
          next: (res: any) => {
            this.notificationMessage(res.message as string);
            this.patientForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            this.notificationMessage(err);
          }
        }
      );
    } else {
      this.updatePatient(_patient);
    }
    
  }
  /**
   * Method for throw a notification
   * @param message string
   */
   notificationMessage(message: string) {
    this._snackBar.open(message,void 0, { 
        duration:3000, 
        horizontalPosition:'center', 
        verticalPosition:'top'
      });
    }

  updatePatient(patient: Patient) {
    patient.id = this.editData.id;
    if(patient) {
      this.patientService.updatePatient(patient).subscribe({
        next: (value) => {
          this._snackBar.open("Se actualizó","",
          {duration:3000,horizontalPosition:'center',verticalPosition:'top'});
          this.patientForm.reset();
          this.dialogRef.close('update');
        }, error: (err) => {
          alert("No se pudo actualizar");
        },
      });
        //error lanza el error de que no pudo actualizar
        //porque esta en la tabla de atencion al paciente y
        //al paciente y pregunta despues si desesa añadir
    }
  }

  openPatientExitNotification() {
    this._snackBar.open("Registrado", "salir");
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    let cn = confirm('Sure ?')
    if (cn) {
      this.dialogRef.close();
    }
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
        console.log('event:', event);
        event.returnValue = false;
  }
}
