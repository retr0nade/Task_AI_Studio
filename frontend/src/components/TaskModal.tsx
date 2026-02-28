import React, { useState, useEffect } from 'react';
import { Task } from '../types/task';

export interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Task;
    onSubmit: (title: string, description: string, acceptanceCriteria: string | null) => Promise<void>;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, initialData, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setTitle(initialData?.title || '');
            setDescription(initialData?.description || '');
            setAcceptanceCriteria(initialData?.acceptance_criteria || '');
            setValidationError(null);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            setValidationError('Both Title and Description are required.');
            return;
        }

        try {
            setIsSubmitting(true);
            setValidationError(null);
            await onSubmit(title.trim(), description.trim(), acceptanceCriteria.trim() || null);
            onClose();
        } catch (err) {
            // Error is caught by wrapper or hook, handled externally via toasts
            setValidationError('Failed to save task.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onClose}
                />
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                            {initialData ? 'Edit Task' : 'Create New Task'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            {validationError && (
                                <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
                                    {validationError}
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Set up database schema"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Details of what needs to be accomplished..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Acceptance Criteria
                                </label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Conditions to satisfy (e.g. Migration script runs without errors)"
                                    value={acceptanceCriteria}
                                    onChange={(e) => setAcceptanceCriteria(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-5 sm:mt-6">
                                <button
                                    type="button"
                                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm sm:w-auto"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm sm:w-auto disabled:bg-blue-300"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
