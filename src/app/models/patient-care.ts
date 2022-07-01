import { Vaccine } from "./vaccine";
import { Patient } from "./patient";

export interface PatientCare {
    id: number;
    patient: Patient;
    vaccine: Vaccine;
    dose: number;
    doseDate: string;
    completeDose: boolean;
}