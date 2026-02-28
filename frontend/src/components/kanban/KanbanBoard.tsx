import React, { useMemo } from 'react';
import { TaskColumn } from './TaskColumn';
import { Task, TaskStatus } from '../../types/task';

interface KanbanBoardProps {
    tasks: Task[];
    onTransition: (taskId: number, ideaId: number, newStatus: TaskStatus) => Promise<void>;
    onSelectTask: (task: Task) => void;
    onNewTask: () => void;
    onEditTask: (task: Task) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTransition, onSelectTask, onNewTask, onEditTask }) => {
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
        <div className="flex flex-col h-full">
            <div className="flex justify-end p-4 shrink-0 border-b border-gray-200 bg-white rounded-t-lg">
                <button
                    onClick={onNewTask}
                    className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition-colors text-sm shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    New Task
                </button>
            </div>
            <div className="flex-1 flex gap-4 overflow-x-auto p-4 h-full bg-gray-50 rounded-b-lg">
                <TaskColumn title="Draft" status="draft" tasks={groupedTasks.draft} onTransition={onTransition} onSelectTask={onSelectTask} onEditTask={onEditTask} />
                <TaskColumn title="Planned" status="planned" tasks={groupedTasks.planned} onTransition={onTransition} onSelectTask={onSelectTask} onEditTask={onEditTask} />
                <TaskColumn title="In Progress" status="in_progress" tasks={groupedTasks.in_progress} onTransition={onTransition} onSelectTask={onSelectTask} onEditTask={onEditTask} />
                <TaskColumn title="Done" status="done" tasks={groupedTasks.done} onTransition={onTransition} onSelectTask={onSelectTask} onEditTask={onEditTask} />
            </div>
        </div>
    );
};
