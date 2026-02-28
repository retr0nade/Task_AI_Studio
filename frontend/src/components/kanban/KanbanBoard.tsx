import React from 'react';
import { TaskColumn } from './TaskColumn';
import { Task } from '../../types/task';

interface KanbanBoardProps {
    tasks: Task[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => {
    return (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
            {/* Task columns will go here */}
            {tasks.length === -1 && <span />}
            <TaskColumn title="Draft" status="draft" />
            <TaskColumn title="Planned" status="planned" />
            <TaskColumn title="In Progress" status="in_progress" />
            <TaskColumn title="Done" status="done" />
        </div>
    );
};
