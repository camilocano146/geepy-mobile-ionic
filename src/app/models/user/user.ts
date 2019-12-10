export class User {
    public id: number;
    public is_lock: boolean;
    public password: string;
    public roles: any;
    public role: any;
    constructor(
        public email: string,
        public first_name: string,
        public last_name: string,
        ) { }
}