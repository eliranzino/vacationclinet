export interface IUser {
    ID: number;
    firstName: string;
    lastName: string;
    UserName: string;
    Password: string | number;
    isAdmin: boolean;
}