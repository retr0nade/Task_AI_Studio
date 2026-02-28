import React from 'react';
import { TaskStatus, Task } from '../../types/task';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    onTransition: (taskId: number, ideaId: number, newStatus: TaskStatus) => Promise<void>;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({ title, status, tasks, onTransition }) => {
    return (
        <div className="w-80 min-w-80 bg-gray-100 rounded-lg p-3 flex flex-col gap-3" data-status={status}>
            <div className="flex justify-between items-center mb-1">
                <h2 className="font-semibold text-gray-700">{title}</h2>
                <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {tasks.length}
                </span>
            </div>

            <div className="flex-1 min-h-[150px] flex flex-col gap-3 overflow-y-auto pr-1">
                {tasks.length === 0 ? (
                    <p className="text-sm text-gray-400 italic text-center mt-4 border-2 border-dashed border-gray-200 rounded-lg p-4">Empty</p>
                ) : (
                    tasks.map(task => <TaskCard key={task.id} task={task} onTransition={onTransition} />)
                )}
            </div>
        </div>
    );
};
