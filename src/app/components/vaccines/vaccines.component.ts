import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import {MatPaginator} from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { VaccineService } from 'src/app/services/vaccine.service'; 
import { Vaccine } from '../../models/vaccine';
import { DialogPatientsVaccinatedHistoryComponent } from '../dialogs/dialog-patients-vaccinated-history/dialog-patients-vaccinated-history.component';
import { DialogVaccineComponent } from '../dialogs/dialog-vaccine/dialog-vaccine.component';

@Component({
  selector: 'app-vaccines',
  templateUrl: './vaccines.component.html',
  styleUrls: ['./vaccines.component.css']
})
export class VaccinesComponent implements OnInit {

  displayedColumns: string[] = ["Nombre", "Días de descanso", "Cantidad", "Dosis completa", "Acciones"];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  form: FormGroup;

  vaccines: Vaccine [] = [];

  constructor(
    private vaccineService: VaccineService, 
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private vaccineDialog: MatDialog) 
  {
    this.form = this.formBuilder.group(
      {
        vaccineName: ['', Validators.required],
        vaccineDays: ['', Validators.required],
        vaccineQuantity: ['', Validators.required],
      }
    )
  }

  ngOnInit(): void {
    this.getVaccines();
  }

  getVaccines() {
    this.vaccineService.getVaccines()
    .subscribe(
      {
        next:(res)=>{
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          localStorage.setItem('getVaccines', JSON.stringify(this.dataSource.data));
        },
        error:(err)=>{
          //alert("Error de carga");
          this._snackBar.open(
            "Error de carga","Salir",
            {horizontalPosition:'center',verticalPosition:'top'});
        }
      }
    );
  }

  detailsPeopleVaccinated() {

  }

  removeVaccine(id: number) {
    const _resp = confirm('Desea eliminar?');
    if (_resp) {
      this.vaccineService.deleteVaccine(id).subscribe({
        next: () => {
          //alert("Paciente eliminado");
          this._snackBar.open(
            "Vacuna eliminada","",
            {duration:3000,horizontalPosition:'center',verticalPosition:'top'});
          this.getVaccines();
        }, error: (err) => {
          //alert("Error al eliminar");
          this._snackBar.open(
            "Error al eliminar","",
            {duration:3000,horizontalPosition:'center',verticalPosition:'top'});

        },
      });
    }
  }

  openVaccineDialog() {
    const dialogRef = this.vaccineDialog
      .open(DialogVaccineComponent, {
        width:'250px',
      })
      .afterClosed().subscribe( _value => {
        if (_value == 'save') {
          this.getVaccines();
        }
      });
  }

  editVaccine(element: any) {
    const dialogRef = this.vaccineDialog
      .open(DialogVaccineComponent, {
        width:'250px',
        data: element,
      })
      .afterClosed().subscribe( _value => {
        if (_value == 'update') {
          this.getVaccines();
        }
      });
  }

  viewPatientsVaccinated(element: any) {
    const dialogRef = this.vaccineDialog
      .open(DialogPatientsVaccinatedHistoryComponent, {
        width:'350px',
        maxHeight: '400px',
        data: element,
      });
  }

  /* Filter the table with any value entered */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
