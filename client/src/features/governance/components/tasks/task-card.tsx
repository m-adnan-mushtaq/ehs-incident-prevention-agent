import UserAvatar from "@/components/layout/user-avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { commonHelpers } from "@/helpers";
import { cn } from "@/lib/utils";
import {
  ITask,
  ITaskPriority,
  ITaskStatus,
} from "@/services/governance/tasks.service";
import { Clock, MessageSquare, Paperclip } from "lucide-react";

type Props = {
  task: ITask;
};

export const TaskStatusChip = ({ status }: { status: ITaskStatus }) => {
  const classesLookup: Record<ITaskStatus, string> = {
    in_progress: "text-yellow-700 bg-yellow-50 hover:bg-yellow-100",
    backlog: " text-gray-700 bg-gray-50 hover:bg-gray-100",
    done: " text-green-700 bg-green-50 hover:bg-green-100",
    todo: " text-blue-700 bg-blue-50 hover:bg-blue-100",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        classesLookup[status],
        "px-4 py-1 min-w-max font-medium transition-colors"
      )}
    >
      {commonHelpers.toTitleCase(status.replace("_", " "))}
    </Badge>
  );
};

export const TaskPriorityChip = ({ priority }: { priority: ITaskPriority }) => {
  const classesLookup: Record<ITaskPriority, string> = {
    medium: "text-yellow-700 bg-yellow-50 hover:bg-yellow-100",
    urgent: " text-purple-700 bg-purple-50 hover:bg-purple-100",
    high: " text-red-700 bg-red-50 hover:bg-red-100",
    low: " text-blue-700 bg-blue-50 hover:bg-blue-100",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        classesLookup[priority],
        "px-4 py-1 min-w-max font-medium transition-colors"
      )}
    >
      {commonHelpers.toTitleCase(priority.replace("_", " "))}
    </Badge>
  );
};

const TaskCard = ({ task }: Props) => {
  const taskBorderColorLookup: Record<ITaskPriority, string> = {
    high: "border-red-500",
    medium: "border-yellow-500",
    low: "border-blue-500",
    urgent: "border-purple-500",
  };

  return (
    <Card
      className={cn(
        "border-0 p-2 border-t-4 w-64 cursor-pointer transition hover:shadow-lg",
        taskBorderColorLookup[task.priority]
      )}
    >
      <div className="flex items-center justify-start w-full gap-2 my-2">
        <TaskStatusChip status={task.status} />
        <TaskPriorityChip priority={task.priority} />
      </div>
      <CardHeader className="p-1 my-0">
        <CardTitle>{task.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {task.due_date && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock size={14} className="mr-1" />
            <span>
              {commonHelpers.getDueStatus(task.due_date)?.statusLabel}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            {!!task.comments?.length && (
              <div
                className="flex items-center"
                title={`${task.comments.length} comments`}
              >
                <MessageSquare size={14} className="mr-1" />
                <span>{task.comments.length}</span>
              </div>
            )}

            {!!task.attachments?.length && (
              <div
                className="flex items-center"
                title={`${task.attachments.length} attachments`}
              >
                <Paperclip size={14} className="mr-1" />
                <span>{task.attachments.length}</span>
              </div>
            )}
          </div>

          {task?.assignee && <UserAvatar size="size-8" user={task.assignee} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
