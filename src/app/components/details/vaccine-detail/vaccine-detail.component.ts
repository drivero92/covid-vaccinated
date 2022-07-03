
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PatientCare } from 'src/app/models/patient-care';
import { Vaccine } from 'src/app/models/vaccine';
import { PatientCareService } from 'src/app/services/patient-care.service';
import { VaccineService } from 'src/app/services/vaccine.service';

@Component({
  selector: 'app-vaccine-detail',
  templateUrl: './vaccine-detail.component.html',
  styleUrls: ['./vaccine-detail.component.css']
})
export class VaccineDetailComponent implements OnInit {

  patientCareHeaderDetail: string[] = ["Pacientes", "Dosis", "Fecha de dosis"];
  patientCareList: PatientCare[] = [];
  vaccine: Vaccine | undefined;
  queryMode: number;

  constructor(
    private vaccineService: VaccineService, 
    private patientCareService: PatientCareService, 
    private route: ActivatedRoute,
    private location: Location,
    ) {
      this.queryMode = 0;
    }

  ngOnInit(): void {
    this.queryMode = +this.route.snapshot.queryParams['queryMode'];
    const _id = Number(this.route.snapshot.paramMap.get('id'));
    switch (this.queryMode) {
      case 1:
        this.getPatientCareListByVaccine(_id);
        break;
    
      default:
        this.getVaccine(_id);
        break;
    }
  }
  /**
   * Returns details of a specific vaccine
   * @param id number
   */
  getVaccine(id: number) {
    this.vaccineService.getVaccine(id).subscribe({
      next: (value) => {
        this.vaccine = value;
      }, error: (err) => {
        alert("No se pudo cargar la vacuna");
      },
    })
  }
  /**
   * Returns a list of patients vaccinated by the selected vaccine
   * @param id number
   */
  getPatientCareListByVaccine(id: number) {
    this.patientCareService.getPatientCareListByVaccineId(id).subscribe({
      next: (value) => {
        this.patientCareList = value;
      }, error: (err) => {
        alert("No se pudo cargar el registro de pacientes vacunados");
      },
    })
  }
 /**
  * updateVaccine this will update the properties of the selected vaccine
  */
 public updateVaccine() {
  if (this.vaccine) {
    this.vaccineService.updateVaccine(this.vaccine).subscribe({
      next: (value) => {
        this.goBack();
        }, error(err) {
          alert("No se pudo actualizar");
        },
      });
  }  
 }
  /**
   * goBack returns the last page
   */
  public goBack() {
    this.location.back();
  }
}
