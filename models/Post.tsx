export interface PostModel {
  id: number;
  title: string;
  organization: string;
  location: string;
  category: string;
  description: string;
  requiredVolunteers: number;
  currentVolunteers: number;
  skillsNeeded: string[];
  imageUrl: string[];
}
