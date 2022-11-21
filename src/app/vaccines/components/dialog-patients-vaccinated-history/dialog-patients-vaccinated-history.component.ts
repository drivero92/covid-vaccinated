import { Component, Inject, OnInit } from '@angular/core';
import { PatientCare } from 'src/app/models/patient-care';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatientCareService } from 'src/app/patient-care/services/patient-care.service';
import { NotificationService } from 'src/app/services/notification.service';

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
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public viewData: PatientCare,
    private dialogRef: MatDialogRef<DialogPatientsVaccinatedHistoryComponent>,
    ) { }

  ngOnInit(): void {
    this.getPatientCareListByVaccine();    
  }

  getPatientCareListByVaccine() {
    this.patientCareService.getPatientCareListByVaccineId(this.viewData.id).subscribe({
      next: (res) => {
        if (res) {
          this.patientFlag = true;
        } else {
          this.patientFlag = false;
        }
        this.patientCareList = res;        
      }, 
      error: (err) => {
        this.notificationService.notificationMessage(err, true);
      },
    });
  }

}
