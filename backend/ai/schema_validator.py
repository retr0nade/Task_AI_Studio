from pydantic import BaseModel, Field

class GeneratedTaskSchema(BaseModel):
    title: str = Field(..., description="The title of the task")
    description: str = Field(..., description="Detailed description of the task")
    acceptance_criteria: str | None = Field(None, description="Criteria for the task to be considered done")

class TaskGenerationResponseSchema(BaseModel):
    tasks: list[GeneratedTaskSchema]
