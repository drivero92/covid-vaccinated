import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { empty } from 'rxjs';
import { FullVaccine } from 'src/app/models/full-vaccine';
import { Vaccine } from 'src/app/models/vaccine';
import { FullVaccineService } from 'src/app/vaccines/services/full-vaccine.service';
import { NotificationService } from 'src/app/services/notification.service';
import { VaccineService } from 'src/app/vaccines/services/vaccine.service';

@Component({
  selector: 'app-dialog-compatible-vaccines',
  templateUrl: './dialog-compatible-vaccines.component.html',
  styleUrls: ['./dialog-compatible-vaccines.component.css']
})
export class DialogCompatibleVaccinesComponent implements OnInit {

  patientCareHeaderDetail: string[] = ["Vacuna", "Dosis completa"];
  vaccineList: Vaccine[] = [];
  vaccineFlag: boolean = false;
  
  constructor(
    private fullVaccineService: FullVaccineService,
    private vaccineService: VaccineService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public viewData: Vaccine,//
    private dialogRef: MatDialogRef<DialogCompatibleVaccinesComponent>,) { }

  ngOnInit(): void {
    this.getCompatibleVaccineList();
  }

  getCompatibleVaccineList() {
    this.fullVaccineService.getVaccineList(this.viewData.id)
      .subscribe({
        next: (res) => {
          if (res) {
            this.vaccineFlag = true;
          } else {
            this.vaccineFlag = false;
          }
          this.vaccineList = res;        
        }, 
        error: (err) => {
          this.notificationService.notificationMessage(err, true);
        },
      });
  }
}
