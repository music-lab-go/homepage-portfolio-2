export interface Profile {
  name: string;
  bio: string;
  photo: string;
  links: { label: string; url: string }[];
}

export interface WorkItem {
  id: string;
  title: string;
  category: 'music' | 'art' | 'project';
  description: string;
  image: string;
  link: string;
}

export interface ScheduleItem {
  id: string;
  date: string;
  title: string;
  description: string;
  link: string;
}
