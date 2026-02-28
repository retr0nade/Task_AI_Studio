import React from 'react';
import { Task } from '../../types/task';

interface TaskCardProps {
    task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    return (
        <div className="bg-white p-3 shadow-sm rounded border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
            <h3 className="font-medium text-sm text-gray-800">{task.title}</h3>
            <p className="text-xs text-gray-500 mt-1 truncate">{task.description}</p>
        </div>
    );
};
