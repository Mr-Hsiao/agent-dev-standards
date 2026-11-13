from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    display_name: str = Field(min_length=1, max_length=80)


class UserRead(BaseModel):
    id: int
    email: EmailStr
    display_name: str

    model_config = ConfigDict(from_attributes=True)
