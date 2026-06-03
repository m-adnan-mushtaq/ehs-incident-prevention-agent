import asyncio
from collections.abc import Coroutine
from typing import TypeVar

from app.db.database import engine

T = TypeVar("T")


async def _run_with_engine_cleanup(coro: Coroutine[object, object, T]) -> T:
    try:
        return await coro
    finally:
        await engine.dispose()


def run_async_task(coro: Coroutine[object, object, T]) -> T:
    """Run a coroutine in a fresh event loop and release async DB connections."""
    return asyncio.run(_run_with_engine_cleanup(coro))
