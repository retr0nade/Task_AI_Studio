import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Task } from '../../types/task';

interface TaskCardProps {
    task: Task;
    index: number;
    onSelectTask: (task: Task) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onSelectTask, onEditTask, onDeleteTask }) => {
    return (
        <Draggable draggableId={task.id.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onSelectTask(task)}
                    className={`bg-white p-4 rounded-xl border border-gray-200 flex flex-col group cursor-grab active:cursor-grabbing transition-all duration-200 ${snapshot.isDragging
                            ? 'shadow-xl ring-2 ring-blue-400 rotate-1 scale-105'
                            : 'shadow-sm hover:shadow-md'
                        }`}
                >
                    {/* Header row: badges + action buttons */}
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${task.is_ai_generated ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                {task.is_ai_generated ? 'AI' : 'Manual'}
                            </span>
                            <span className="text-[10px] font-medium text-gray-400 capitalize bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                {task.status.replace('_', ' ')}
                            </span>
                        </div>

                        {/* Edit + Delete icons (visible on hover) */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => { e.stopPropagation(); onEditTask(task); }}
                                className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50"
                                title="Edit Task"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                </svg>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeleteTask(task); }}
                                className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50"
                                title="Delete Task"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Task title & description */}
                    <h3 className="font-semibold text-sm text-gray-800 mb-1.5 leading-snug">{task.title}</h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>

                    {/* Acceptance criteria */}
                    {task.acceptance_criteria && (
                        <div className="bg-gray-50 rounded p-2.5 mb-1 border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 flex items-center gap-1.5 tracking-wide">
                                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Criteria
                            </p>
                            <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">{task.acceptance_criteria}</p>
                        </div>
                    )}

                    {/* Drag hint */}
                    {!snapshot.isDragging && (
                        <p className="mt-2 text-[10px] text-gray-300 text-right select-none">drag to move ⠿</p>
                    )}
                </div>
            )}
        </Draggable>
    );
};
