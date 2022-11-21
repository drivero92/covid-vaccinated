import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FullVaccine } from 'src/app/models/full-vaccine';
import { Vaccine } from 'src/app/models/vaccine';
import { FullVaccineService } from 'src/app/vaccines/services/full-vaccine.service';
import { DialogCompatibleVaccinesComponent } from '../dialog-compatible-vaccines/dialog-compatible-vaccines.component';
import { DialogFullVaccineComponent } from '../../../components/dialogs/dialog-full-vaccine/dialog-full-vaccine.component';

@Component({
  selector: 'app-full-vaccine',
  templateUrl: './full-vaccine.component.html',
  styleUrls: ['./full-vaccine.component.css']
})
export class FullVaccineComponent implements OnInit {
  
  fullVaccineTitle: string = "Vacuna completa";
  displayedColumns: string[] = ["Nombre", "Días de descanso", "Cantidad", "Dosis completa", "Acciones"];
  fullVaccines: FullVaccine[] = [];
  dataSource!: MatTableDataSource<any>;

  constructor(
    private fullVaccineService: FullVaccineService, 
    private fullVaccineDialog: MatDialog) { }

  ngOnInit(): void {
    this.getFullVaccines();
  }

  getFullVaccines() {
    this.fullVaccineService.getFullVaccines().subscribe({
      next: (res) => {
        if (res) {
          this.fullVaccines = res;
          this.dataSource = new MatTableDataSource(res);
        }
      },
    });
  }
  openVaccineDialog() {
    const dialogRef = this.fullVaccineDialog
      .open(DialogFullVaccineComponent, {
        width: '250px',
      })
      .afterClosed().subscribe( val => {
        if (val == 'save') {
          this.getFullVaccines();
        }
      })
  }
  viewCompatibleVaccines(element: any) {
    const dialogRef = this.fullVaccineDialog
      .open(DialogCompatibleVaccinesComponent, {
        width: '400px',
        data: element,
      });
  }
}
