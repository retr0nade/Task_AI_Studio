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
            const rawMsg = err instanceof Error ? err.message : '';
            // Map backend 409 rejection into a friendly, actionable message
            let friendlyMsg: string;
            if (rawMsg.toLowerCase().includes('acceptance criteria')) {
                friendlyMsg = '⚠️ This task needs Acceptance Criteria before it can be marked as Done. Click Edit to add one.';
            } else if (rawMsg.includes('409') || rawMsg.toLowerCase().includes('cannot transition')) {
                const NEXT_STEP: Partial<Record<TaskStatus, string>> = {
                    draft: 'Draft → Planned',
                    planned: 'Planned → In Progress',
                    in_progress: 'In Progress → Done',
                    done: 'Done → Planned (re-plan)',
                };
                // Find which status the task is currently in by searching tasks array
                const currentTask = tasks.find(t => t.id === taskId);
                const hint = currentTask ? NEXT_STEP[currentTask.status] : null;
                friendlyMsg = hint
                    ? `❌ Illegal move. The only valid next step is: ${hint}`
                    : '❌ That transition is not allowed. Tasks must follow the workflow order.';
            } else {
                friendlyMsg = rawMsg || 'Failed to move task';
            }
            setError(friendlyMsg);
            showToast(friendlyMsg, 'error');
            throw err;
        }
    };


    const createTask = async (ideaId: number, title: string, description: string, acceptanceCriteria: string | null) => {
        try {
            setError(null);
            const newTask = await apiRequest<Task>('/tasks', {
                method: 'POST',
                body: JSON.stringify({
                    idea_id: ideaId,
                    title,
                    description,
                    acceptance_criteria: acceptanceCriteria
                })
            });
            await fetchTasks(ideaId.toString());
            showToast('Task created successfully', 'success');
            return newTask;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to create task';
            setError(msg);
            showToast(msg, 'error');
            throw err;
        }
    };

    const updateTask = async (taskId: number, ideaId: number, title: string, description: string, acceptanceCriteria: string | null) => {
        try {
            setError(null);
            const updatedTask = await apiRequest<Task>(`/tasks/${taskId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title,
                    description,
                    acceptance_criteria: acceptanceCriteria
                })
            });
            await fetchTasks(ideaId.toString());
            showToast('Task updated successfully', 'success');
            return updatedTask;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to update task';
            setError(msg);
            showToast(msg, 'error');
            throw err;
        }
    };

    const deleteTask = async (taskId: number, ideaId: number) => {
        try {
            setError(null);
            await apiRequest(`/tasks/${taskId}`, {
                method: 'DELETE'
            });
            await fetchTasks(ideaId.toString());
            showToast('Task deleted successfully', 'success');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete task';
            setError(msg);
            showToast(msg, 'error');
            throw err;
        }
    };

    return { tasks, loading, isGenerating, error, fetchTasks, generateTasks, transitionTask, createTask, updateTask, deleteTask };
};
