export interface IUser {
  id: number;
  email: string;
  username: string;
}

export interface IUsersData {
  users: IUser[];
}
