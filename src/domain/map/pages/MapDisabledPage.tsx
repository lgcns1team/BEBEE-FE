import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Header from "../../../components/Header";
import MapBasePage from "./MapBasePage";
import MapDisabledBottomSheet from "../components/bottomsheet/components/MapDisabledBottomSheet";
import { mapApi } from "../../../api/mapApi";
import { useUserStore } from "../../../store/useUserStore";
import { useMapStore } from "../store/useMapStore";

const pxToRem = (px: number) => `${px / 16}rem`;
const HEADER_HEIGHT_REM = pxToRem(73);

const MapDisabledPage = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();

 
  const findType = useMapStore((s) => s.findType);
  const center = useMapStore((s) => s.center);
  const radiusKm = useMapStore((s) => s.radiusKm);
  const helpers = useMapStore((s) => s.helpers);

  const setFindType = useMapStore((s) => s.setFindType);
  const setCenter = useMapStore((s) => s.setCenter);
  const setRadiusKm = useMapStore((s) => s.setRadiusKm);
  const setHelpers = useMapStore((s) => s.setHelpers);
  const clearHelpers = useMapStore((s) => s.clearHelpers);

  
  const locationLabel = useMemo(
    () => (findType === "CURRENT" ? "현재 위치" : "집"),
    [findType]
  );

  const [loading, setLoading] = useState(false);

  /** 현재 위치 기준 */
  const moveToCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setFindType("CURRENT");
      },
      () => {
        
        setFindType("HOME");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [setCenter, setFindType]);

  /** 집(프로필) 기준 */
  const moveToHomeLocation = useCallback(() => {
    setFindType("HOME");

    
    if (user?.latitude != null && user?.longitude != null) {
      setCenter({ lat: user.latitude, lng: user.longitude });
    }
  }, [setCenter, setFindType, user]);

  /** 최초 진입 → 현재 위치 */
  useEffect(() => {
    moveToCurrentLocation();
  }, [moveToCurrentLocation]);

  /** 기준 위치 or 반경 변경 시 API 호출 */
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

   
        const params =
          findType === "CURRENT"
            ? {
                type: "CURRENT" as const,
                latitude: center.lat,
                longitude: center.lng,
                radius: radiusKm, // km
              }
            : {
                type: "HOME" as const,
                radius: radiusKm, // km
              };

        const res = await mapApi.getNearByHelpers(params as any);

        if (!alive) return;
        setHelpers(res.nearByHelpers ?? []);
      } catch (e) {
        if (!alive) return;
        clearHelpers();
      }
    })();

    return () => {
      alive = false;
    };
  }, [center.lat, center.lng, radiusKm, findType, setHelpers, clearHelpers]);

  return (
    <Container>
      <HeaderWrapper>
        <Header title="동네지도" showBack onBack={() => navigate(-1)} />
      </HeaderWrapper>

      <Content>
        <MapBasePage
          mode="HELPER"
          center={center}
          radius={radiusKm * 1000} 
          markers={helpers} 
        />
      </Content>

      <BottomSheetWrapper>
        <MapDisabledBottomSheet
          onClickCurrentLocation={moveToCurrentLocation}
          onClickHomeLocation={moveToHomeLocation}
          addressRoad={user?.addressRoad ?? ""}
          locationLabel={locationLabel}
          radius={radiusKm}
          onChangeRadius={setRadiusKm}
        />
      </BottomSheetWrapper>
    </Container>
  );
};
export default MapDisabledPage;

const Container = styled.div`
  height: 100vh;
  background: white;
  overflow: hidden;
  position: relative;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  padding: 0 16px;
  box-sizing: border-box;
  height: ${HEADER_HEIGHT_REM};
`;

const Content = styled.div`
  position: absolute;
  top: ${HEADER_HEIGHT_REM};
  left: 0;
  width: 100%;
  height: calc(100vh - ${HEADER_HEIGHT_REM});
`;

const BottomSheetWrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  pointer-events: none;
`;
