import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Header from "../../../components/Header";
import MapBasePage from "./MapBasePage";
import MapHelperBottomSheet from "../components/bottomsheet/components/MapHelperBottomSheet";

import { useUserStore } from "../../../store/useUserStore";
import { useMapStore } from "../store/useMapStore";
import { useNearbyPosts } from "../components/bottomsheet/hooks/useNearbyPosts";

const pxToRem = (px: number) => `${px / 16}rem`;
const HEADER_HEIGHT_REM = pxToRem(73);

const MapHelperPage = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  
  const findType = useMapStore((s) => s.findType);
  const center = useMapStore((s) => s.center);
  const radiusKm = useMapStore((s) => s.radiusKm);
  const posts = useMapStore((s) => s.posts);

  const setFindType = useMapStore((s) => s.setFindType);
  const setCenter = useMapStore((s) => s.setCenter);
  const setRadiusKm = useMapStore((s) => s.setRadiusKm);

  const locationLabel = useMemo(
    () => (findType === "CURRENT" ? "현재 위치" : "집"),
    [findType]
  );


  const { loading } = useNearbyPosts({
    type: findType,
    latitude: center.lat,
    longitude: center.lng,
    radiusKm,
  });

  /** 현재 위치 */
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

  /** HOME 위치 */
  const moveToHomeLocation = useCallback(() => {
    setFindType("HOME");

    // 지도 중심 이동용 
    if (user?.latitude != null && user?.longitude != null) {
      setCenter({ lat: user.latitude, lng: user.longitude });
    }
  }, [setCenter, setFindType, user]);

  /** 최초 진입 */
  useEffect(() => {
    moveToCurrentLocation();
  }, [moveToCurrentLocation]);

  return (
    <Container>
      <HeaderWrapper>
        <Header title="동네지도" showBack onBack={() => navigate(-1)} />
      </HeaderWrapper>

      <Content>
        <MapBasePage
          mode="POST"              
          center={center}
          radius={radiusKm * 1000} 
          markers={posts}          
                 
        />
      </Content>

      <BottomSheetWrapper>
        <MapHelperBottomSheet
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

export default MapHelperPage;

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