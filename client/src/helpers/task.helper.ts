import { ITask, ITaskStatus } from "@/services/governance/tasks.service";

export const groupTaskByStatus = (tasks: ITask[]) => {
  const groupedTasks: Record<ITaskStatus, ITask[]> = {
    backlog: [],
    todo: [],
    in_progress: [],
    done: [],
  };

  tasks.forEach((task) => {
    groupedTasks[task.status].push(task);
  });

  return groupedTasks;
};
