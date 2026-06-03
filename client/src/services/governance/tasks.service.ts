import { IUser } from "../auth.service";

export enum ITaskStatus {
  BACKLOG = "backlog",
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

export enum ITaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export const taskStatusOptions = [
  {
    label: "Backlog",
    value: ITaskStatus.BACKLOG,
  },
  {
    label: "To Do",
    value: ITaskStatus.TODO,
  },
  {
    label: "In Progress",
    value: ITaskStatus.IN_PROGRESS,
  },
  {
    label: "Done",
    value: ITaskStatus.DONE,
  },
];

export const taskPriorityOptions = [
  {
    label: "Low",
    value: ITaskPriority.LOW,
  },
  {
    label: "Medium",
    value: ITaskPriority.MEDIUM,
  },
  {
    label: "High",
    value: ITaskPriority.HIGH,
  },
  {
    label: "Urgent",
    value: ITaskPriority.URGENT,
  },
];

export interface ITaskComment {
  id: string;
  pk: number;
  comment: string;
  author: IUser;
  created_at: string;
  updated_at: string;
}

export interface ITask {
  id: string;
  pk: number;
  name: string;
  description: string;
  due_date: string;
  status: ITaskStatus;
  priority: ITaskPriority;
  assignee?: IUser;
  created_at: string;
  updated_at: string;
  comments?: ITaskComment[];
  attachments?: string[];
}
