import { Vaccine } from "./vaccine";

export interface FullVaccine {
    id: number
    vaccine: Vaccine;
    vaccines: Array<Vaccine>;
}