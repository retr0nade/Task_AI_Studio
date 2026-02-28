import React from 'react';
import { useParams } from 'react-router-dom';

export const IdeaDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="p-4 flex flex-col h-full">
            <h1 className="text-2xl font-bold mb-4">Idea Details {id}</h1>
            {/* Kanban board and history will go here */}
        </div>
    );
};
