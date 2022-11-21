import { Component, OnInit } from '@angular/core';
import { PatientCare } from 'src/app/models/patient-care';
import { Location } from '@angular/common';
import { PatientCareService } from 'src/app/patient-care/services/patient-care.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-care-detail',
  templateUrl: './patient-care-detail.component.html',
  styleUrls: ['./patient-care-detail.component.css']
})
export class PatientCareDetailComponent implements OnInit {

  patientCareHeaderDetail: string[] = ["Vacunas", "Dosis", "Fecha de dosis"];
  patientCares: PatientCare[] = [];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private patientCareService: PatientCareService) { }

  ngOnInit(): void {
    this.getPatient();
  }

  getPatient() {
    let id = Number(this.route.snapshot.paramMap.get('id'));
    this.patientCareService.getPatientCareListByPatientId(id)
        .subscribe(patient => this.patientCares = patient);
  }

  goBack(): void {
    this.location.back();
  }

}
