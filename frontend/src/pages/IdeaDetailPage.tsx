import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Idea } from '../types/idea';
import { apiRequest } from '../api/client';
import { useTasks } from '../hooks/useTasks';
import { KanbanBoard } from '../components/kanban/KanbanBoard';

export const IdeaDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [idea, setIdea] = useState<Idea | null>(null);
    const [ideaLoading, setIdeaLoading] = useState<boolean>(true);
    const [ideaError, setIdeaError] = useState<string | null>(null);

    const { tasks, loading: tasksLoading, isGenerating, fetchTasks, generateTasks, transitionTask } = useTasks();

    useEffect(() => {
        if (!id) return;

        // Fetch specifically the idea details
        const fetchIdeaDetails = async () => {
            try {
                setIdeaLoading(true);
                const data = await apiRequest<Idea>(`/ideas/${id}`);
                setIdea(data);
            } catch (err) {
                setIdeaError(err instanceof Error ? err.message : 'Failed to fetch idea details');
            } finally {
                setIdeaLoading(false);
            }
        };

        fetchIdeaDetails();
        fetchTasks(id);
    }, [id, fetchTasks]);

    if (ideaLoading) {
        return <div className="p-8 text-gray-500">Loading idea...</div>;
    }

    if (ideaError || !idea) {
        return (
            <div className="p-8">
                <div className="bg-red-50 text-red-700 p-4 rounded-md inline-block">
                    {ideaError || 'Idea not found.'}
                </div>
            </div>
        );
    }

    const hasTasks = tasks.length > 0;

    return (
        <div className="p-8 flex flex-col h-full bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6 shrink-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{idea.title}</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Created on {new Date(idea.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    <button
                        onClick={() => id && generateTasks(id)}
                        disabled={isGenerating || tasksLoading}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${hasTasks
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isGenerating ? 'Generating...' : hasTasks ? 'Regenerate Tasks' : 'Generate Tasks'}
                    </button>
                </div>

                <div className="mt-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{idea.description}</p>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-gray-100 rounded-lg flex flex-col">
                {tasksLoading ? (
                    <div className="text-gray-500 p-4">Loading tasks...</div>
                ) : hasTasks ? (
                    <KanbanBoard tasks={tasks} onTransition={transitionTask} />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-4">
                        <p>No tasks generated yet.</p>
                        <p className="text-sm">Click "Generate Tasks" to analyze your idea and automatically construct a sprint plan.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
