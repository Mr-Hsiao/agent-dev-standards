from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate


class UserService:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session
        self._users = UserRepository(session)

    async def create_user(self, payload: UserCreate) -> User:
        if await self._users.get_by_email(str(payload.email)):
            raise ValueError("该邮箱已注册")  # Replace with the project's BusinessError.

        user = User(
            email=str(payload.email),
            display_name=payload.display_name,
        )
        await self._users.add(user)
        await self._session.commit()
        await self._session.refresh(user)
        return user
