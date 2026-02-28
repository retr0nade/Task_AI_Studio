import { useState, useEffect, useCallback } from 'react';
import { Idea } from '../types/idea';
import { apiRequest } from '../api/client';

export const useIdeas = () => {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchIdeas = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiRequest<Idea[]>('/api/ideas');
            setIdeas(data || []);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch ideas');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIdeas();

        // Listen for custom event to synchronize instances of this hook
        const handleUpdate = () => fetchIdeas();
        window.addEventListener('ideas-updated', handleUpdate);
        return () => window.removeEventListener('ideas-updated', handleUpdate);
    }, [fetchIdeas]);

    const createIdea = async (title: string, description: string): Promise<Idea> => {
        try {
            setIsCreating(true);
            setError(null);
            const newIdea = await apiRequest<Idea>('/api/ideas', {
                method: 'POST',
                body: JSON.stringify({ title, description }),
            });
            // Dispatch event so other components (like Sidebar) can refresh their lists
            window.dispatchEvent(new Event('ideas-updated'));
            return newIdea;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to create idea';
            setError(msg);
            throw new Error(msg);
        } finally {
            setIsCreating(false);
        }
    };

    return { ideas, loading, isCreating, error, createIdea, refetch: fetchIdeas };
};
