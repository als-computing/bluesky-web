# flake8: noqa
print(f"Loading file {__file__!r}")

from typing import Any, Dict, List, Optional

from bluesky.plans import (
    count,
    scan,
    spiral,
)


def marked_up_count(
    detectors: List[Any], num: int = 1, delay: Optional[float] = None, md: Optional[Dict[str, Any]] = None
):
    return (yield from count(detectors, num=num, delay=delay, md=md))