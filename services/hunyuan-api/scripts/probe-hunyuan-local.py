from __future__ import annotations

import json

from app.config import get_settings
from app.workers.generation_providers import probe_runtime_providers, resolve_active_provider


def main() -> int:
    settings = get_settings()
    payload = {
        "activeProvider": resolve_active_provider(settings),
        "providers": [item.model_dump() for item in probe_runtime_providers(settings)],
    }
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
