export interface Jwt {
    token: string;
    type: string;
    userName: string;
    authorities: string[];
}