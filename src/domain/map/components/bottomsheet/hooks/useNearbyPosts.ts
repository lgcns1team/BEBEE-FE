import { useEffect, useState } from "react";
import { mapApi } from "../../../../../api/mapApi";
import type { MapFindType } from "../../../../../types/map.type";
import {useMapStore} from "../../../store/useMapStore"

type Args = {
  type: MapFindType;
  latitude?: number;
  longitude?: number;
  radiusKm: number; // km
};

export function useNearbyPosts({ type, latitude, longitude, radiusKm }: Args) {
  const setPosts = useMapStore((s) => s.setPosts);
  const clearPosts = useMapStore((s) => s.clearPosts);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const canFetch =
      type === "HOME" || (type === "CURRENT" && latitude != null && longitude != null);

    if (!canFetch) {
      clearPosts();
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const params =
          type === "CURRENT"
            ? {
                type: "CURRENT" as const,
                latitude,
                longitude,
                radius: radiusKm , // ✅ km
              }
            : {
                type: "HOME" as const,
                radius: radiusKm , // ✅ km
              };

        const res = await mapApi.getNearByPosts(params as any);

        if (!alive) return;
        setPosts(res.nearbyPosts ?? []);
      } catch (e: any) {
        if (!alive) return;
        clearPosts();
        setError(e?.message ?? "주변 게시글 조회 실패");
      } 
    })();

    return () => {
      alive = false;
    };
  }, [type, latitude, longitude, radiusKm, setPosts, clearPosts]);

  return { loading, error };
}