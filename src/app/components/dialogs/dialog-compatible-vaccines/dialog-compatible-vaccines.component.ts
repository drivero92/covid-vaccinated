import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FullVaccine } from 'src/app/models/full-vaccine';
import { Vaccine } from 'src/app/models/vaccine';
import { FullVaccineService } from 'src/app/services/full-vaccine.service';

@Component({
  selector: 'app-dialog-compatible-vaccines',
  templateUrl: './dialog-compatible-vaccines.component.html',
  styleUrls: ['./dialog-compatible-vaccines.component.css']
})
export class DialogCompatibleVaccinesComponent implements OnInit {

  patientCareHeaderDetail: string[] = ["Vacuna", "Dosis completa"];
  vaccineList: Vaccine[] = [];
  
  constructor(
    private fullVaccineService: FullVaccineService,
    @Inject(MAT_DIALOG_DATA) public viewData: FullVaccine,
    private dialogRef: MatDialogRef<DialogCompatibleVaccinesComponent>,) { }

  ngOnInit(): void {
    this.getCompatibleVaccineList();
  }

  getCompatibleVaccineList() {
    this.fullVaccineService.getVaccineList(this.viewData.id)
      .subscribe(vaccines => this.vaccineList = vaccines);
  }
}
