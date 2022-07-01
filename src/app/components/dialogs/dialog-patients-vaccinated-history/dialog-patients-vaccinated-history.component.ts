import { Component, Inject, OnInit } from '@angular/core';
import { PatientCare } from 'src/app/models/patient-care';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatientCareService } from 'src/app/services/patient-care.service';

@Component({
  selector: 'app-dialog-patients-vaccinated-history',
  templateUrl: './dialog-patients-vaccinated-history.component.html',
  styleUrls: ['./dialog-patients-vaccinated-history.component.css']
})
export class DialogPatientsVaccinatedHistoryComponent implements OnInit {

  patientCareHeaderDetail: string[] = ["Pacientes", "Dosis", "Fecha de dosis"];
  patientCareList: PatientCare[] = [];
  patientFlag: boolean = false;

  constructor(
    private patientCareService: PatientCareService,
    @Inject(MAT_DIALOG_DATA) public viewData: PatientCare,
    private dialogRef: MatDialogRef<DialogPatientsVaccinatedHistoryComponent>,
    ) { }

  ngOnInit(): void {
    this.getPatientCareListByVaccine();    
  }

  getPatientCareListByVaccine() {
    this.patientCareService.getPatientCareListByIdVaccine(this.viewData.id).subscribe({
      next: (value) => {
        if (value) {
          this.patientFlag = true;
        } else {
          this.patientFlag = false;
        }
        this.patientCareList = value;        
      }, error: (err) => {
        alert("No se pudo cargar el registro de pacientes vacunados");
      },
    })
  }

}
