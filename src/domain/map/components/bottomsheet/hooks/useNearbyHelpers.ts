import { useEffect, useState } from "react";
import { mapApi } from "../../../../../api/mapApi";
import type { MapFindType } from "../../../../../types/map.type";
import { useMapStore } from "../../../store/useMapStore";

type Args = {
  type: MapFindType;
  latitude?: number;
  longitude?: number;
  radius?: number;
};

export function useNearbyHelpers({
  type,
  latitude,
  longitude,
  radius,
}: Args) {
  const setHelpers = useMapStore((s) => s.setHelpers);
  const clearHelpers = useMapStore((s) => s.clearHelpers);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canFetch =
      type === "HOME" ||
      (type === "CURRENT" && latitude != null && longitude != null);

    if (!canFetch) {
      clearHelpers();
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await mapApi.getNearByHelpers({
          type,
          latitude,
          longitude,
          radius,
        });

        setHelpers(data.nearByHelpers ?? []);
      } catch (e: any) {
        setError(e?.message ?? "주변 도우미 조회 실패");
        clearHelpers();
      } finally {
        setLoading(false);
      }
    })();
  }, [type, latitude, longitude, radius, setHelpers, clearHelpers]);

  return { loading, error };
}
