import { mock_tasks } from "@/constants/mock";
import TaskList from "./task-list";
import { useMemo, useState } from "react";
import { taskHelpers } from "@/helpers";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(mock_tasks);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const groupedTasks = useMemo(() => {
    return taskHelpers.groupTaskByStatus(mock_tasks);
  }, [tasks]);

  const handleDragEnd = (event: any) => {};

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full flex gap-4 max-h-[78vh] no-scrollbar overflow-auto">
        {Object.entries(groupedTasks).map(([status, tasks]) => (
          <TaskList label={status} key={status} tasks={tasks} />
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
