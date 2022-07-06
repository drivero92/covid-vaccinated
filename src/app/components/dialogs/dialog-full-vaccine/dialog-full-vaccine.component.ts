import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Vaccine } from 'src/app/models/vaccine';
import { FullVaccineService } from 'src/app/services/full-vaccine.service';
import { VaccineService } from 'src/app/services/vaccine.service';

@Component({
  selector: 'app-dialog-full-vaccine',
  templateUrl: './dialog-full-vaccine.component.html',
  styleUrls: ['./dialog-full-vaccine.component.css']
})
export class DialogFullVaccineComponent implements OnInit {

  actionBtn: string = "Guardar";
  vaccineList: Vaccine[] = [];
  fullVaccineForm: FormGroup = this.formBuilder.group({
    vaccine: [''],
    vaccines: new FormArray([]),
  });
  
  constructor(
    private fullVaccineService: FullVaccineService,
    private vaccineService: VaccineService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogFullVaccineComponent>,) { }

  ngOnInit(): void {
    this.getVaccineList();  
  }

  getVaccineList() {
    this.vaccineService.getVaccines().subscribe({
      next: (res) => {
        this.vaccineList = res;
        this.addCheckboxes();
      }
    });
  }
  private addCheckboxes() {
    this.vaccineList.forEach(() => this.vaccinesFormArray.push(new FormControl(false)));
  }
  get vaccinesFormArray() {
    return this.fullVaccineForm.controls['vaccines'] as FormArray;
  }

  // saveModal() {
  //   this.fullVaccineService.addFullVaccine().subscribe({
  //   });
  // }
}
