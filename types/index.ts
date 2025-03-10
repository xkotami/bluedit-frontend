export type Profile = {
  id: number;
  description: string;
  profilePic: string;
}

export type User = {
  id: number;
  username: string;
  password: string;
  profile: Profile;
  balance: number;
};