import React, { useMemo } from 'react';
import { TaskColumn } from './TaskColumn';
import { Task, TaskStatus } from '../../types/task';

interface KanbanBoardProps {
    tasks: Task[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => {
    // Group tasks strictly by status
    const groupedTasks = useMemo(() => {
        const groups: Record<TaskStatus, Task[]> = {
            draft: [],
            planned: [],
            in_progress: [],
            done: []
        };

        tasks.forEach(task => {
            if (groups[task.status]) {
                groups[task.status].push(task);
            }
        });

        // Ensure tasks inside each column are sorted by created_at (oldest first or newest first, choosing oldest for standard progression)
        Object.keys(groups).forEach(key => {
            const status = key as TaskStatus;
            groups[status].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        });

        return groups;
    }, [tasks]);

    return (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 h-full">
            <TaskColumn title="Draft" status="draft" tasks={groupedTasks.draft} />
            <TaskColumn title="Planned" status="planned" tasks={groupedTasks.planned} />
            <TaskColumn title="In Progress" status="in_progress" tasks={groupedTasks.in_progress} />
            <TaskColumn title="Done" status="done" tasks={groupedTasks.done} />
        </div>
    );
};
