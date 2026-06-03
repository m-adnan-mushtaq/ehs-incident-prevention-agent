import { Button } from "@/components/ui/button";
import { ITask } from "@/services/governance/tasks.service";
import { EllipsisVertical } from "lucide-react";
import TaskCard from "./task-card";
import { toTitleCase } from "@/helpers/common";

type Props = {
  tasks: ITask[];
  label: string;
};

const TaskList = ({ tasks, label }: Props) => {
  return (
    <div className="rounded max-w-max p-4  bg-white">
      <div className="flex items-center my-2 justify-between">
        <h3 className="text-lg font-medium">{toTitleCase(label)}</h3>
        <Button variant={"ghost"} size={"icon"}>
          <EllipsisVertical />
        </Button>
      </div>
      <div className="flex flex-col h-full overflow-auto no-scrollbar  gap-4 items-center">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
