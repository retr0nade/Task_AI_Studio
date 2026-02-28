import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { TaskStatus, Task } from '../../types/task';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    onSelectTask: (task: Task) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (task: Task) => void;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({ title, status, tasks, onSelectTask, onEditTask, onDeleteTask }) => {
    return (
        <div className="w-80 min-w-80 bg-gray-100 rounded-lg p-3 flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-300px)]" data-status={status}>
            <div className="flex justify-between items-center mb-1">
                <h2 className="font-semibold text-gray-700">{title}</h2>
                <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {tasks.length}
                </span>
            </div>

            <Droppable droppableId={status}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 min-h-[150px] flex flex-col gap-3 pr-1 rounded-lg transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50' : ''
                            }`}
                    >
                        {tasks.length === 0 && !snapshot.isDraggingOver ? (
                            <p className="text-sm text-gray-400 italic text-center mt-4 border-2 border-dashed border-gray-200 rounded-lg p-4">Empty</p>
                        ) : (
                            tasks.filter(t => t && t.id != null).map((task, index) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    index={index}
                                    onSelectTask={onSelectTask}
                                    onEditTask={onEditTask}
                                    onDeleteTask={onDeleteTask}
                                />
                            ))
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};
