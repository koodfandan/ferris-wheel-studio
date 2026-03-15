import json


def build_mock_spatial_manifest(asset_id: str) -> str:
    manifest = {
        "version": 1,
        "bundleId": asset_id,
        "assets": [
            {
                "id": f"{asset_id}-character",
                "role": "character",
                "anchors": {
                    "root": [0, 0, 0],
                    "head": [0, 1.64, 0],
                    "left_hand": [0.76, 0.8, 0.26],
                },
                "proxies": [
                    {
                        "id": "character-body",
                        "type": "box",
                        "size": [1.48, 2.88, 1.18],
                        "offset": [0, 1.38, 0.08],
                    },
                    {
                        "id": "character-head",
                        "type": "sphere",
                        "radius": 1.04,
                        "offset": [0, 1.72, 0],
                    },
                ],
                "clearance": {
                    "top": 0.08,
                    "bottom": 0.08,
                    "front": 0.08,
                    "back": 0.08,
                    "side": 0.08,
                },
                "solveAxes": ["x", "y", "z"],
                "metrics": {
                    "preferredZ": 0.32,
                    "preferredY": 0.06,
                },
                "fallbacks": [],
            }
        ],
    }
    return json.dumps(manifest, ensure_ascii=False, indent=2)
