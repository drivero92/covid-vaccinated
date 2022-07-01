import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Vaccine } from 'src/app/models/vaccine';
import { VaccineService } from 'src/app/services/vaccine.service';

@Component({
  selector: 'app-dialog-vaccine',
  templateUrl: './dialog-vaccine.component.html',
  styleUrls: ['./dialog-vaccine.component.css']
})
export class DialogVaccineComponent implements OnInit {

  actionBtn: string = "Guardar";
  vaccineForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    quantity: ['', Validators.required],
    restDays: ['', Validators.required],
    completeDose: ['', Validators.required],
  });

  constructor(
    private vaccineService: VaccineService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public editData: Vaccine,
    private dialogRef: MatDialogRef<DialogVaccineComponent>,
    ) { }

  ngOnInit(): void {
    if (this.editData) {
      this.actionBtn = "Actualizar";
      this.vaccineForm.controls['name'].setValue(this.editData.name);
      this.vaccineForm.controls['quantity'].setValue(this.editData.quantity);
      this.vaccineForm.controls['restDays'].setValue(this.editData.restDays);
      this.vaccineForm.controls['completeDose'].setValue(this.editData.completeDose);
    }
  }

  saveVaccineModal() {
    const _vaccine = this.vaccineForm.value;
    console.log("v ",_vaccine);
    if (!this.editData) {
      this.vaccineService.addVaccine(_vaccine).subscribe(
        {
          next: (res: any) => {
            this.notificationMessage(res.message as string);
            this.vaccineForm.reset();
            this.dialogRef.close('save');
          }, 
          error: (err) => {
            this.notificationMessage(err);
          },
        }
      );
    } else {
      this.updateVaccine(_vaccine);
    }
    
  }

  public updateVaccine(vaccine: Vaccine) {
    vaccine.id = this.editData.id;
    if (this) {
      this.vaccineService.updateVaccine(vaccine).subscribe({
        next: (value) => {
          this._snackBar.open("Se actualizó","",
          {duration:3000,horizontalPosition:'center',verticalPosition:'top'});
          this.vaccineForm.reset();
          this.dialogRef.close('update');
          }, error(err) {
            alert("No se pudo actualizar");
          },
        });
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
    openVaccineNotification() {
    this._snackBar.open("Registrado", "salir");
  }

}
