import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Vacunados de Covid';

  routes: any[] = [
    {
      name: 'Pacientes vacunados',
      router: ['patientcares'],
    },
    {
      name:'Pacientes',
      router: ['patients'],
    },
    {
      name: 'Vacunas',
      router: ['vaccines'],
    },
  ]
}
