import { useState, useCallback } from 'react';
import { TaskHistory } from '../types/task';
import { apiRequest } from '../api/client';
import toast from 'react-hot-toast';

export const useTaskHistory = () => {
    const [history, setHistory] = useState<TaskHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = useCallback(async (taskId: number) => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiRequest<TaskHistory[]>(`/tasks/${taskId}/history`);
            setHistory(data || []);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to fetch task history';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
    }, []);

    return { history, loading, error, fetchHistory, clearHistory };
};
