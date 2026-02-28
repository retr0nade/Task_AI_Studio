import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { TaskColumn } from './TaskColumn';
import { Task, TaskStatus } from '../../types/task';

const STATUSES: TaskStatus[] = ['draft', 'planned', 'in_progress', 'done'];
const COLUMN_TITLES: Record<TaskStatus, string> = {
    draft: 'Draft',
    planned: 'Planned',
    in_progress: 'In Progress',
    done: 'Done',
};

interface KanbanBoardProps {
    tasks: Task[];
    onTransition: (taskId: number, ideaId: number, newStatus: TaskStatus) => Promise<void>;
    onSelectTask: (task: Task) => void;
    onNewTask: () => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (task: Task) => void;
}

type GroupedTasks = Record<TaskStatus, Task[]>;

function groupByStatus(tasks: Task[]): GroupedTasks {
    const groups: GroupedTasks = { draft: [], planned: [], in_progress: [], done: [] };
    for (const task of tasks) {
        if (groups[task.status]) groups[task.status].push(task);
    }
    for (const status of STATUSES) {
        groups[status].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }
    return groups;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
    tasks,
    onTransition,
    onSelectTask,
    onNewTask,
    onEditTask,
    onDeleteTask,
}) => {
    // Local optimistic state — allows instant visual feedback before API confirms
    const [localGroups, setLocalGroups] = useState<GroupedTasks>(() => groupByStatus(tasks));

    // Keep local groups in sync when prop tasks change (e.g. after delete/create)
    useEffect(() => {
        setLocalGroups(groupByStatus(tasks));
    }, [tasks]);

    const handleDragEnd = useCallback(async (result: DropResult) => {
        const { draggableId, source, destination } = result;

        // Dropped outside a valid column → do nothing
        if (!destination) return;
        // Dropped in the same column same position → do nothing
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const sourceStatus = source.droppableId as TaskStatus;
        const destStatus = destination.droppableId as TaskStatus;

        // Find task by its stable draggableId, NOT by array index (index can shift during React renders)
        const taskId = parseInt(draggableId, 10);
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        // --- Optimistic Update ---
        setLocalGroups(prev => {
            const next = { ...prev };
            // Deep-copy the two affected columns
            next[sourceStatus] = [...prev[sourceStatus]];
            next[destStatus] = [...prev[destStatus]];
            // Remove from source column
            const srcIdx = next[sourceStatus].findIndex(t => t.id === taskId);
            if (srcIdx === -1) return prev; // safety guard
            next[sourceStatus].splice(srcIdx, 1);
            // Insert optimistically updated task into destination
            const optimisticTask = { ...task, status: destStatus };
            next[destStatus].splice(destination.index, 0, optimisticTask);
            return next;
        });

        // --- Backend API ---
        try {
            await onTransition(task.id, task.idea_id, destStatus);
        } catch {
            // API rejected (e.g. 409 illegal transition) — rollback to server-confirmed state
            setLocalGroups(groupByStatus(tasks));
        }
    }, [tasks, onTransition]);

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
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
                    {STATUSES.map(status => (
                        <TaskColumn
                            key={status}
                            title={COLUMN_TITLES[status]}
                            status={status}
                            tasks={localGroups[status]}
                            onSelectTask={onSelectTask}
                            onEditTask={onEditTask}
                            onDeleteTask={onDeleteTask}
                        />
                    ))}
                </div>
            </div>
        </DragDropContext>
    );
};
