export interface User{
    id:number;
    name:string;
    email:string;
    role:UserRole;
}

export enum UserRole{
    ADMIN = "admin",
    CUSTOMER = "customer",
}