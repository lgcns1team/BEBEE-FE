import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Header from "../../../components/Header";
import MapBasePage from "./MapBasePage";
import MapDisabledBottomSheet from "../components/bottomsheet/components/MapDisabledBottomSheet";
import { mapApi } from "../../../api/mapApi";
import type { MapFindType, NearByHelperDto } from "../../../types/map.type";
import { useUserStore } from "../../../store/useUserStore";
const pxToRem = (px: number) => `${px / 16}rem`;
const HEADER_HEIGHT_REM = pxToRem(73);

const MapDisabledPage = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  /** 기준 상태 */
  const [findType, setFindType] = useState<MapFindType>("CURRENT");
  const [center, setCenter] = useState({ lat: 33.450701, lng: 126.570667 });
  const [locationLabel, setLocationLabel] = useState("현재 위치");
  const [radiusKm, setRadiusKm] = useState(1);

  
  const [helpers, setHelpers] = useState<NearByHelperDto[]>([]);

  /** 현재 위치 기준 */
  const moveToCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };

      setCenter(next);
      setFindType("CURRENT");
      setLocationLabel("현재 위치");
    });
  }, []);


  const moveToHomeLocation = useCallback(() => {
    if (!user) return;
    const { latitude, longitude } = user;

    //   if (
    //   typeof latitude !== "number" ||
    //   typeof longitude !== "number" ||
    //   !Number.isFinite(latitude) ||
    //   !Number.isFinite(longitude)
    // ) {
    //   return;
    // }

    setCenter({ lat: latitude, lng: longitude });
    setFindType("HOME");
    setLocationLabel("집");
    console.log("회원가입할때의 위도,경도", latitude, longitude);
    console.log("회원 정보", user);
  }, [user]);
  /** 최초 진입 → 현재 위치 */
  useEffect(() => {
    moveToCurrentLocation();
  }, [moveToCurrentLocation]);

  /** 기준 위치 or 반경 변경 시 API 호출 */
  useEffect(() => {
    let alive = true;

    (async () => {
      
      const res = await mapApi.getNearByHelpers({
        type: findType,
        latitude: center.lat,
        longitude: center.lng,
        radius: radiusKm * 1000,
      });

      if (!alive) return;
      setHelpers(res.nearByHelpers);
    })();

    return () => {
      alive = false;
    };
  }, [center.lat, center.lng, radiusKm, findType]);

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
          addressRoad={user.addressRoad} 
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
