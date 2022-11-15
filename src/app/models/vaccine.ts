export interface Vaccine {
    id: number,
    name: string,
    quantity: number,
    restDays: number,
    numberDoses: number,
    vaccines: Array<Vaccine>,
}