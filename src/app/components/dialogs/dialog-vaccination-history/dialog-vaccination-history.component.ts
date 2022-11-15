import { Component, Inject, OnInit } from '@angular/core';
import { PatientCare } from 'src/app/models/patient-care';
import { PatientCareService } from 'src/app/services/patient-care.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogPatientComponent } from '../dialog-patient/dialog-patient.component';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-dialog-vaccination-history',
  templateUrl: './dialog-vaccination-history.component.html',
  styleUrls: ['./dialog-vaccination-history.component.css']
})
export class DialogVaccinationHistoryComponent implements OnInit {

  patientCareHeaderDetail: string[] = ["Vacuna", "Dosis", "Fecha de dosis"];
  patientCareList: PatientCare [] = [];
  vaccineFlag: boolean = false;
  // dataSource!: MatTableDataSource<any>;

  constructor(
    private patientCareService: PatientCareService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public viewData: PatientCare,
    private dialogRef: MatDialogRef<DialogVaccinationHistoryComponent>,
  ) { }

  ngOnInit(): void {
    this.getPatientCare();
    
  }

  getPatientCare() {
    this.patientCareService.getPatientCareListByPatientId(this.viewData.id).subscribe({
        next: (res) => {
          if (res) {
            this.vaccineFlag = true;
          } else {
            this.vaccineFlag = false;
          }
          this.patientCareList = res;
          // this.dataSource = new MatTableDataSource(res);          
        }, 
        error: (err) => {
          this.notificationService.notificationMessage(err, true);
        },
      });
  }

}
