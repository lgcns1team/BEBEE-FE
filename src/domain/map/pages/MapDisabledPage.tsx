import { useCallback, useEffect, useRef, useState } from "react";

import MapDisabledBottomSheet from "../components/bottomsheet/components/MapDisabledBottomSheet";
import MapBasePage from "./MapBasePage";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import styled from "styled-components";

const pxToRem = (px: number) => `${px / 16}rem`;
const HEADER_HEIGHT_REM = pxToRem(73);

const MapDisabledPage = () => {
  const navigate = useNavigate();
  const [center, setCenter] = useState({ lat: 33.450701, lng: 126.570667 });
  const [locationLabel, setLocationLabel] = useState("장충동");
  const [radiusKm, setRadiusKm] = useState(1);
  const mapRef = useRef<kakao.maps.Map | null>(null);

  const moveToCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const nextCenter = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      setCenter(nextCenter);
      setLocationLabel("현재 위치");
      if (mapRef.current) {
        mapRef.current.setCenter(
          new kakao.maps.LatLng(nextCenter.lat, nextCenter.lng)
        );
      }
    });
  }, []);

  /** 최초 진입 시 현재 위치 */
  useEffect(() => {
    moveToCurrentLocation();
  }, [moveToCurrentLocation]);

  return (
    <Container>
      <HeaderWrapper>
        <Header title="동네지도" onBack={() => navigate(-1)} />
      </HeaderWrapper>

      <Content>
        <MapBasePage center={center} radius={radiusKm * 1000} />
      </Content>

      <BottomSheetWrapper>
        <MapDisabledBottomSheet
          onClickCurrentLocation={moveToCurrentLocation}
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
  background-color: ${({ theme }) => theme.color.white};
  height: 100vh;
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
