export type TaskStatus =
    | "draft"
    | "planned"
    | "in_progress"
    | "done";

export interface Task {
    id: number;
    idea_id: number;
    title: string;
    description: string;
    acceptance_criteria: string | null;
    status: TaskStatus;
    is_ai_generated: boolean;
    created_at: string;
}

export interface TaskHistory {
    id: number;
    task_id: number;
    from_status: TaskStatus;
    to_status: TaskStatus;
    changed_at: string;
    note?: string;
}
