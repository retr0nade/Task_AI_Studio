import { useState, useCallback } from 'react';
import { Task, TaskStatus } from '../types/task';
import { apiRequest } from '../api/client';
import toast from 'react-hot-toast';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async (ideaId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiRequest<Task[]>(`/tasks/idea/${ideaId}`);
            setTasks(data || []);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    }, []);

    const generateTasks = async (ideaId: string) => {
        try {
            setIsGenerating(true);
            setError(null);
            const data = await apiRequest<Task[]>(`/ideas/${ideaId}/generate-tasks`, {
                method: 'POST',
            });
            setTasks(data || []);
            toast.success('Tasks successfully generated!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to generate tasks';
            setError(msg);

            // Look for specific API error signatures from the message mapping
            if (msg.includes('409') || msg.toLowerCase().includes('already generated')) {
                toast.error('Tasks have already been generated for this idea (409 Conflict).');
            } else if (msg.includes('502') || msg.toLowerCase().includes('ai service')) {
                toast.error('Failed to communicate with AI generation service (502 Bad Gateway).');
            } else {
                toast.error(msg);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const transitionTask = async (taskId: number, ideaId: number, newStatus: TaskStatus) => {
        try {
            setError(null);
            await apiRequest<Task>(`/tasks/${taskId}/transition`, {
                method: 'PATCH',
                body: JSON.stringify({ to_status: newStatus })
            });
            await fetchTasks(ideaId.toString());
            // toast.success(`Task moved to ${newStatus.replace('_', ' ')}`);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to transition task';
            setError(msg);
            toast.error(msg);
            throw err;
        }
    };

    return { tasks, loading, isGenerating, error, fetchTasks, generateTasks, transitionTask };
};
