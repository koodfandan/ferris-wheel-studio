import { useEffect, useMemo, useState } from "react";
import { createSpatialRegistry, type SpatialRegistry } from "./asset-registry";
import { validateSpatialBundleManifest, type SpatialBundleManifest } from "./spatial-manifest";

type SpatialBundleState =
  | {
      status: "default";
      bundle: null;
      registry: SpatialRegistry;
      label: string;
    }
  | {
      status: "loaded";
      bundle: SpatialBundleManifest;
      registry: SpatialRegistry;
      label: string;
    }
  | {
      status: "error";
      bundle: null;
      registry: SpatialRegistry;
      label: string;
    };

const DEFAULT_REGISTRY = createSpatialRegistry();

export function useSpatialBundle(url = "/models/collector-spatial.json") {
  const [bundle, setBundle] = useState<SpatialBundleManifest | null>(null);
  const [status, setStatus] = useState<"default" | "loaded" | "error">("default");

  useEffect(() => {
    let active = true;

    fetch(url, { cache: "no-store" })
      .then(async (response) => {
        if (!active) return;
        if (!response.ok) {
          setBundle(null);
          setStatus("default");
          return;
        }

        const parsed = await response.json();
        if (!active) return;

        const validation = validateSpatialBundleManifest(parsed);
        if (validation.ok) {
          setBundle(validation.bundle);
          setStatus("loaded");
        } else {
          setBundle(null);
          setStatus("error");
        }
      })
      .catch(() => {
        if (active) {
          setBundle(null);
          setStatus("default");
        }
      });

    return () => {
      active = false;
    };
  }, [url]);

  return useMemo<SpatialBundleState>(() => {
    if (status === "loaded" && bundle) {
      return {
        status,
        bundle,
        registry: createSpatialRegistry(bundle),
        label: "Spatial registry active",
      };
    }

    if (status === "error") {
      return {
        status,
        bundle: null,
        registry: DEFAULT_REGISTRY,
        label: "Spatial bundle is invalid, using built-in defaults",
      };
    }

    return {
      status: "default",
      bundle: null,
      registry: DEFAULT_REGISTRY,
      label: "Using built-in spatial registry",
    };
  }, [bundle, status]);
}
