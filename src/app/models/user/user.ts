import { Global } from '../global/global';

export class User {
    public id: number;
    public is_lock: boolean;
    public password: string;
    public roles: any;
    public role: any;
    public organization: number;
    constructor(
        public email: string,
        public first_name: string,
        public last_name: string,
        ) {
            this.organization = Global.organization_id;
        }
}