export interface User {
  id: string | null;
  firstName: string;
  lastName: string;
  jobTitle: string;
  profilePicture: string | null;
  screenName?: string;
}
