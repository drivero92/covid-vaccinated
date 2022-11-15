import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FullVaccine } from 'src/app/models/full-vaccine';
import { Vaccine } from 'src/app/models/vaccine';
import { FullVaccineService } from 'src/app/services/full-vaccine.service';
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
  checkedVaccine: boolean = false;
  _vaccines: string[] = [];
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
    private fullVaccineService: FullVaccineService,
    private formBuilder: FormBuilder,
    private notification: NotificationService,
    @Inject(MAT_DIALOG_DATA) public editData: Vaccine,
    private dialogRef: MatDialogRef<DialogVaccineComponent>) { }

  ngOnInit(): void {
    this.getVaccineList();
    this.putDataInForm();
    this.exitModalDialogByClick();
  }
  getVaccineList() {
    if (localStorage.getItem('getVaccines') && '{}') {
      this.vaccines = JSON.parse(localStorage.getItem('getVaccines') || '{}');
      this.addCheckboxes();
    } else {
      this.vaccineService.getVaccines()
        .subscribe(vaccines => {
          this.addCheckboxes();
          this.vaccines = vaccines;
        });
    }
  }
  getPatientCareDialogForm(): Form {
    const selectedOrderIds = this.vaccineDialogForm.value.compatibleVaccines
      .map((checked: any, i: any) => checked ? this.vaccines[i].id : null)
      .filter((v: any) => v !== null);

    const idsArray = selectedOrderIds
      .map((value: any) => ({ id: value }));
    /**
     * Other way for get an IDs array
     */
    // let idsArray = [];
    // for (let i = 0; i < selectedOrderIds.length; i++) {
    //   const tempObj = {
    //     id: selectedOrderIds[i],
    //   };
    //   idsArray.push(tempObj);
    // }
    const combinedFields: any = {
      name: this.vaccineDialogForm.value.name,
      quantity: this.vaccineDialogForm.value.quantity,
      restDays: this.vaccineDialogForm.value.restDays,
      numberDoses: this.vaccineDialogForm.value.numberDoses,
      vaccines: idsArray,
    };
    return combinedFields;
  }

  saveVaccineModal() {
    const _vaccine = this.getPatientCareDialogForm();
    if (!this.editData) {
      this.fullVaccineService.addFullVaccine(_vaccine).subscribe({
        next: (res: any) => {
          this.notification.notificationMessage(res.message as string);
          this.vaccineDialogForm.reset();
          this.dialogRef.close('save');
        },
        error: (err) => {
          this.notification.notificationMessage(err, true);
        },
      });
    } else {
      this.updateVaccine(_vaccine);
    }
  }
  public updateVaccine(vaccine: any) {
    vaccine.id = this.editData.id;
    if (this) {
      this.fullVaccineService.updateFullVaccine(vaccine).subscribe({
        next: (res: any) => {
          this.notification.notificationMessage(res.message);
          this.vaccineDialogForm.reset();
          this.dialogRef.close('update');
        },
        error: (err) => {
          this.notification.notificationMessage(err, true);
        },
      });
    }
  }
  private addCheckboxes() {
    if (this.editData) {
      const _vaccineNames = this.editData.vaccines.map(vaccine => vaccine.name);
      this.vaccines.forEach(vaccine => {        
        if (_vaccineNames.includes(vaccine.name)) {
          this.vaccinesFormArray.push(new FormControl(true));
        } else if (this.editData.name === vaccine.name) {
          this.vaccinesFormArray.push(new FormControl({value: false, disabled: true}));
        } else {
          this.vaccinesFormArray.push(new FormControl(false))
        }        
      });
    } else {
      this.vaccines.forEach(() => this.vaccinesFormArray.push(new FormControl(false)));
    }    
  }
  get vaccinesFormArray() {
    return this.vaccineDialogForm.controls['compatibleVaccines'] as FormArray;
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
