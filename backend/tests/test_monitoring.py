"""Tests for Prometheus monitoring integration (/metrics)."""

from __future__ import annotations

from typing import Any
import pytest
from vena.api import app


def test_metrics_endpoint_registered() -> None:
    """Verify that Prometheus instrumentator registers the /metrics route."""
    routes = [route.path for route in app.routes if hasattr(route, "path")]
    assert "/metrics" in routes, "Prometheus /metrics route must be registered in FastAPI app"


def test_health_check_references_metrics() -> None:
    """Verify that health check reports status and metrics location."""
    from vena.api import health_check

    response = health_check()
    assert response["status"] == "healthy"
    assert "metrics" in response
    assert response["metrics"] == "/metrics"


def test_metrics_endpoint_response() -> None:
    """Verify that /metrics endpoint returns HTTP 200 with Prometheus payload."""
    import asyncio

    async def _run() -> None:
        scope: dict[str, Any] = {
            "type": "http",
            "method": "GET",
            "path": "/metrics",
            "headers": [],
            "query_string": b"",
            "server": ("127.0.0.1", 80),
        }
        responses: list[dict[str, Any]] = []

        async def send(msg: dict[str, Any]) -> None:
            responses.append(msg)

        async def receive() -> dict[str, Any]:
            return {"type": "http.request"}

        await app(scope, receive, send)

        status_code = next(r["status"] for r in responses if "status" in r)
        assert status_code == 200

        body = b"".join([r.get("body", b"") for r in responses]).decode("utf-8")
        assert "python_info" in body or "process_virtual_memory_bytes" in body

    asyncio.run(_run())
