export class ResetPassword {
  constructor(
    public password_1: string,
    public password_2: string,
    public token: string
  ) {}
}
