export interface Section {
  id: string;
  name: string;
  color?: string;
  position: number;
}

export interface Update {
  user: string;
  action: string;
  date: string;  // ISO string for dates
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
  completed: boolean;
  deadline?: string;
  updates?: Update[];
}
