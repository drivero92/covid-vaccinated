import { Component, HostListener,Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Vaccine } from 'src/app/models/vaccine';
import { NotificationService } from 'src/app/services/notification.service';
import { VaccineService } from 'src/app/services/vaccine.service';

@Component({
  selector: 'app-dialog-vaccine',
  templateUrl: './dialog-vaccine.component.html',
  styleUrls: ['./dialog-vaccine.component.css']
})
export class DialogVaccineComponent implements OnInit {

  actionBtn: string = "Guardar";
  vaccines: Vaccine[] = [];
  textRegEx = /^[a-zA-Z ]+$/;
  numberRegEx = /\-?\d*\.?\d{1,2}/;
  vaccineDialogForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.pattern(this.textRegEx)]],
    quantity: ['', [Validators.required, Validators.pattern(this.numberRegEx)]],
    restDays: ['', [Validators.required, Validators.pattern(this.numberRegEx)]],
    numberDoses: ['', [Validators.required, Validators.pattern(this.numberRegEx)]],
    compatibleVaccines: new FormArray([]),
  });

  constructor(
    private vaccineService: VaccineService,
    private formBuilder: FormBuilder,
    private notification: NotificationService,
    @Inject(MAT_DIALOG_DATA) public editData: Vaccine,
    private dialogRef: MatDialogRef<DialogVaccineComponent>) { }

  ngOnInit(): void {
    this.getVaccineList();
    this.putDataInForm();
    this.exitModalDialogByClick();    
  }
  /* get ordersFormArray() {
    return this.form.controls.orders as FormArray;
  } */
  getVaccineList() {
    if (localStorage.getItem('getVaccines') && '{}') {
      this.vaccines = JSON.parse(localStorage.getItem('getVaccines') || '{}');
    } else {
      this.vaccineService.getVaccines()
        .subscribe(vaccines => this.vaccines = vaccines);
    }
  }
  saveVaccineModal() {
    const _vaccine = this.vaccineDialogForm.value;
    if (!this.editData) {
      this.vaccineService.addVaccine(_vaccine).subscribe({
        next: (res: any) => {
          this.notification.notificationMessage(res.message as string);
          this.vaccineDialogForm.reset();
          this.dialogRef.close('save');
        }, 
        error: (err) => {
          this.notification.notificationMessage(err,true);
        },
      });
    } else {
      this.updateVaccine(_vaccine);
    }
  }
  public updateVaccine(vaccine: Vaccine) {
    vaccine.id = this.editData.id;
    if (this) {
      this.vaccineService.updateVaccine(vaccine).subscribe({
        next: (res: any) => {
          this.notification.notificationMessage(res.message);
          this.vaccineDialogForm.reset();
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
      this.vaccineDialogForm.controls['name'].setValue(this.editData.name);
      this.vaccineDialogForm.controls['quantity'].setValue(this.editData.quantity);
      this.vaccineDialogForm.controls['restDays'].setValue(this.editData.restDays);
      this.vaccineDialogForm.controls['numberDoses'].setValue(this.editData.numberDoses);
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
