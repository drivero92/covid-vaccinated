import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialsModule } from '../materials/materials.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialsModule
  ],
  exports: [
    MaterialsModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
