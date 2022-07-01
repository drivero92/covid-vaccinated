import { Pipe, PipeTransform } from '@angular/core';
import { PatientCare } from '../models/patient-care';
import * as _ from 'underscore';
import { Vaccine } from '../models/vaccine';

@Pipe({
  name: 'orderDose'
})
export class OrderDosePipe implements PipeTransform {

  /* transform(patientCareList: Vaccine[], args: string): Vaccine[] {
    // if (args) {
    //   return _.sortBy(patientCareList, (patientCare: PatientCare) => patientCare.vaccine.name)
    // } else {
    //   return patientCareList;
    // }
    let pc;
    console.log("antes pc: ",patientCareList);
    if (!patientCareList || !args) {
      return patientCareList;
    }
    pc = patientCareList.filter(_patientCares => 
      _patientCares.name.toLocaleLowerCase().indexOf(args.toLocaleLowerCase()) !== -1);
      console.log("pc: ",pc);
      return pc;
    // let pc;
    // switch (args) {
    //   case "name":
    //     console.log("antes pc: ",patientCareList);
    //     pc = _.sortBy(patientCareList, (patientCare: Vaccine) => patientCare.name);
    //     console.log("pc: ",pc);
    //   return pc;
    //     break;
    
    //   default:
    //     return patientCareList;
    //     break;
    // }
  } */
  transform(patientCareList: Vaccine[], value: number): string {
    var data =   patientCareList.filter(
          element => element.id === value );
          return  data[0].name; 
  }
}
