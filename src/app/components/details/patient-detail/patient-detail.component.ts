import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Patient } from 'src/app/models/patient';
import { PatientService } from 'src/app/patients/services/patient.service';
import { Location } from '@angular/common';
import { PatientCare } from 'src/app/models/patient-care';
import { PatientCareService } from 'src/app/patient-care/services/patient-care.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit {

  patientCareHeaderDetail: string[] = ["Vacuna", "Dosis", "Fecha de dosis"];
  patient: Patient | undefined;
  patientCareList: PatientCare [] = [];
  editMode!: number;
  //queryMode: represents the modes whose patient is selecting
  //which are: 0(default) = edit-details, 1 = vaccination-details
  queryMode: number;

  constructor(
    private patientService: PatientService,
    private patientCareService: PatientCareService,
    private route: ActivatedRoute,
    private location: Location,
    ) {
      this.queryMode = 0;
    }

  ngOnInit(): void {
    this.queryMode = +this.route.snapshot.queryParams['queryMode'];
    switch (this.queryMode) {
      case 1:
        this.getPatientCare();       
        break;
    
      default:
        this.getPatient();
        break;
    }
  }

  getPatient() {
    let id = Number(this.route.snapshot.paramMap.get('id'));
    this.patientService.getPatient(id)
        .subscribe(patient => this.patient = patient);
  }

  getPatientCare() {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.patientCareService.getPatientCareListByPatientId(id).subscribe(
      {
        next: (value) => {
          this.patientCareList = value;
        }, error: (err) => {
          alert("Error al cargar la lista del paciente: "+ id);
        },
      }
      );
  }

  updatePatient() {
    if(this.patient) {
      this.patientService.updatePatient(this.patient).subscribe({
        next: (value) => {
          this.goBack();
        }, error: (err) => {
          alert("No se pudo actualizar");
        },
      });
        //error lanza el error de que no pudo actualizar
        //porque esta en la tabla de atencion al paciente y
        //al paciente y pregunta despues si desesa añadir
    }
  }

  goBack(): void {
    this.location.back();
  }

}
