import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Vaccine } from 'src/app/models/vaccine';
import { FullVaccineService } from 'src/app/vaccines/services/full-vaccine.service';
import { VaccineService } from 'src/app/vaccines/services/vaccine.service';

@Component({
  selector: 'app-dialog-full-vaccine',
  templateUrl: './dialog-full-vaccine.component.html',
  styleUrls: ['./dialog-full-vaccine.component.css']
})
export class DialogFullVaccineComponent implements OnInit {

  actionBtn: string = "Guardar";
  vaccineList: Vaccine[] = [];
  fullVaccineForm: FormGroup = this.formBuilder.group({
   
    vaccines: new FormArray([]),
    // vaccines: new FormArray([
    //   new FormGroup({
    //     id: new FormControl(false),
    //   })
    // ]),
    // vaccines: this.formBuilder.array([{id: new FormControl()}]),
    // vaccines: this.formBuilder.array([
    //   {id: new FormControl(),}
    // ])
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
  newVaccineC(): FormGroup {
    return this.formBuilder.group({
      id: [''],
    });
  }
  private addCheckboxes() {
    id: new FormControl();
    this.vaccineList.forEach(() => this.vaccinesFormArray.push(new FormControl(false)));// id: new FormControl()  this.newVaccineC()
  }
  get vaccinesFormArray(): FormArray {
    return this.fullVaccineForm.controls['vaccines'] as FormArray;
  }

  submit() {
    const selectedOrderIds = this.fullVaccineForm.value.vaccines
      .map((checked: any, i: any) => checked ? this.vaccineList[i].id : null)
      .filter((v: any) => v !== null);
    
      // let is: number[]=[];
    // console.log(selectedOrderIds);
    // selectedOrderIds.forEach((v:any) => {console.log(v);is.push(v)});
    // console.log("is: ", is.map(v => v));
    // this.fullVaccineForm.controls['compatibleVaccines'].setValue({id: selectedOrderIds.value});
    const _vaccine = this.fullVaccineForm.value;
    console.log("_vaccine ",_vaccine);
    console.log("selectedOrderIds ", selectedOrderIds);
    // this.fullVaccineService.addFullVaccine().subscribe({
    // });
  }
}
