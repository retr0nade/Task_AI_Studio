import React from 'react';
import { TaskStatus } from '../../types/task';

interface TaskColumnProps {
    title: string;
    status: TaskStatus;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({ title, status }) => {
    return (
        <div className="w-80 min-w-80 bg-gray-100 rounded-lg p-3 flex flex-col gap-3" data-status={status}>
            <h2 className="font-semibold text-gray-700">{title}</h2>
            <div className="flex-1 min-h-[150px]">
                {/* Task cards will be rendered here */}
                <p className="text-sm text-gray-500 italic">No tasks yet.</p>
            </div>
        </div>
    );
};
