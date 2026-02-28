import { useState, useCallback } from 'react';
import { Task, TaskStatus } from '../types/task';
import { apiRequest } from '../api/client';
import { useToast } from '../components/ToastProvider';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

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
            showToast('Tasks successfully generated!', 'success');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to generate tasks';
            setError(msg);

            // Look for specific API error signatures from the message mapping
            if (msg.includes('409') || msg.toLowerCase().includes('already generated')) {
                showToast(msg, 'error'); // Requirement: "409 shows backend message"
            } else if (msg.includes('502') || msg.toLowerCase().includes('ai service')) {
                showToast('Failed to communicate with AI generation service', 'error'); // Requirement: "502 shows AI failure message"
            } else {
                showToast(msg, 'error');
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
                body: JSON.stringify({ status: newStatus })
            });
            await fetchTasks(ideaId.toString());
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to transition task';
            setError(msg);
            showToast(msg, 'error');
            throw err;
        }
    };

    return { tasks, loading, isGenerating, error, fetchTasks, generateTasks, transitionTask };
};
