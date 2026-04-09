export type Lang = 'ja' | 'en';

export interface LocalizedString {
  ja: string;
  en: string;
}

export interface Profile {
  name: LocalizedString;
  bio: LocalizedString;
  photo: string;
  links: { label: string; url: string }[];
}

export interface WorkItem {
  id: string;
  title: LocalizedString;
  category: 'music' | 'art' | 'project';
  description: LocalizedString;
  image: string;
  link: string;
}

export interface ScheduleItem {
  id: string;
  date: string;
  title: LocalizedString;
  description: LocalizedString;
  link: string;
}
