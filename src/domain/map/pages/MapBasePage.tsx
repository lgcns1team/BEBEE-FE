import { useRef } from "react";
import { Map, MapMarker, useKakaoLoader, Circle } from "react-kakao-maps-sdk";
import styled from "styled-components";

import type { NearByPostDto, NearByHelperDto } from "../../../types/map.type";
import CurrentLocationImage from "../components/images/current-location-red-with-radius.svg";
import MapHelper from "../../../assets/images/map-helper.png"
import MapDisabled from "../../../assets/images/map-disabled.png"
type Center = { lat: number; lng: number };

type Props =
  | {
      mode: "POST";
      center: Center;
      radius: number; // meter
      markers: NearByPostDto[];
    }
  | {
      mode: "HELPER";
      center: Center;
      radius: number; // meter
      markers: NearByHelperDto[];
    };

const pxToRem = (px: number) => `${px / 16}rem`;
const HEADER_HEIGHT_REM = pxToRem(73);

const MapBasePage = (props: Props) => {
  const mapRef = useRef<kakao.maps.Map | null>(null);

  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
  });

  if (loading) return <div>지도 로딩중...</div>;
  if (error) return <div>지도 로드 실패</div>;

  const { center, radius } = props;

  const markers = props.markers ?? [];

  return (
    <MapWrapper>
      <Map
        center={center}
        style={{ width: "100%", height: "100%" }}
        level={6}
        onCreate={(map) => (mapRef.current = map)}
      >
        {/* 기준 위치 마커 */}
        <MapMarker
          position={center}
          image={{
            src: CurrentLocationImage,
            size: { width: 45, height: 45 },
          }}
        />

        {/* 반경 */}
        <Circle
          center={center}
          radius={radius}
          strokeWeight={2}
          strokeOpacity={0.8}
          strokeColor="red"
          fillColor="red"
          fillOpacity={0.2}
        />

        {/* 역할별 마커 */}
        {props.mode === "POST"
          ? markers.map((post) => (
              <MapMarker
                key={`post-${post.postId}`}
                position={{ lat: post.latitude, lng: post.longitude }}
                title={post.title}
                image={{
                  src: MapDisabled,
                  size: { width: 25, height: 25 },
                }}
              />
            ))
          : markers.map((helper) => (
              <MapMarker
                key={`helper-${helper.id}`}
                position={{ lat: helper.latitude, lng: helper.longitude }}
                title={helper.nickname}
                image={{
                  src: MapHelper,
                  size: { width: 25, height: 25 },
                }}
              />
            ))}
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
`;
