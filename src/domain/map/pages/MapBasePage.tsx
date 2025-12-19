import { useRef } from "react";
import {
  Map,
  MapMarker,
  useKakaoLoader,
  Circle,
  CustomOverlayMap,
} from "react-kakao-maps-sdk";
import styled from "styled-components";
import CurrentLocationImage from "../components/images/current-location-red-with-radius.svg";

interface Props {
  center: { lat: number; lng: number };
  radius?: number;
}
const pxToRem = (px: number) => `${px / 16}rem`;
const HEADER_HEIGHT_REM = pxToRem(73);
const MapBasePage = ({ center, radius = 1000 }: Props) => {
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
  });

  if (loading) return <div>지도 로딩중...</div>;
  if (error) return <div>지도 로드 실패</div>;

  return (
    <MapWrapper>
      <Map
        center={center}
        style={{ width: "100%", height: "100%" }}
        level={6}
        draggable
        zoomable
        onCreate={(map) => {
          mapRef.current = map;
        }}
      >
        <MapMarker
          position={center}
          image={{ src: CurrentLocationImage, size: { width: 45, height: 45 } }}
        />

        <Circle
          center={center}
          radius={radius}
          strokeWeight={2}
          strokeOpacity={0.8}
          strokeColor="red"
          strokeStyle="solid"
          fillColor="red"
          fillOpacity={0.2}
        />

        <CustomOverlayMap position={center} />
      </Map>
    </MapWrapper>
  );
};

export default MapBasePage;

const MapWrapper = styled.div`
  position: fixed;
  width: 100%;
  max-width: 375px;
  margin: 0 auto;
  top: ${HEADER_HEIGHT_REM};
  height: 100vh;
  bottom: 0;
  z-index: 0;
`;
