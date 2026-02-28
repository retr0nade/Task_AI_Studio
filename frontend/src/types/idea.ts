export interface Idea {
    id: number;
    title: string;
    description: string;
    status: "draft" | "planned" | "archived";
    created_at: string;
}
