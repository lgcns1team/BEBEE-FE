// import { useCallback, useEffect, useRef, useState } from "react";

// import MapDisabledBottomSheet from "../components/bottomsheet/components/MapDisabledBottomSheet";
// import MapBasePage from "./MapBasePage";
// import { useNavigate } from "react-router-dom";
// import Header from "../../../components/Header";
// import styled from "styled-components";
// import { useAuthSignUpForm } from "../../../store/useAuthSignUpStore";
// import { mapApi } from "../../../api/mapApi";
// import { getDistanceMeter } from "../utils/distance";
// import { MapFindType } from "../../../types/map.type";
// import { PostItem } from "../../../types/post.type";
// const pxToRem = (px: number) => `${px / 16}rem`;
// const HEADER_HEIGHT_REM = pxToRem(73);

// const MapDisabledPage = () => {
//   // 회원 가입 시 저장된 집 정보
//   const {
//     latitude: homeLat,
//     longitude: homeLng,
//     addressRoad,
//   } = useAuthSignUpForm();
//   const navigate = useNavigate();
//   const [center, setCenter] = useState({ lat: 33.450701, lng: 126.570667 });
//   const [locationLabel, setLocationLabel] = useState("현재 위치");
//   const [radiusKm, setRadiusKm] = useState(1);
//   const mapRef = useRef<kakao.maps.Map | null>(null);
//   const [locationSouce, setLocationSource] = useState<MapFindType>("CURRENT");
//   const [allPosts, setAllPosts] = useState<PostItem[]>([]);
//   const [filteredPosts, setFilteredPosts] = useState<PostItem[]>;
//   const [findType, setFindType] = useState<MapFindType>("CURRENT");

//   const { latitude, longitude, addressRoad } = useAuthSignUpForm();
//   // const moveToCurrentLocation = useCallback(() => {
//   //   if (!navigator.geolocation) return;

//   //   navigator.geolocation.getCurrentPosition((pos) => {
//   //     const nextCenter = {
//   //       lat: pos.coords.latitude,
//   //       lng: pos.coords.longitude,
//   //     };

//   //     setCenter(nextCenter);
//   //     setLocationLabel("현재 위치");
//   //     if (mapRef.current) {
//   //       mapRef.current.setCenter(
//   //         new kakao.maps.LatLng(nextCenter.lat, nextCenter.lng)
//   //       );
//   //     }
//   //   });
//   // }, []);
//   // 현재 위치 기준
//   const moveToCurrentLocation = useCallback(() => {
//     navigator.geolocation.getCurrentPosition((pos) => {
//       const next = {
//         lat: pos.coords.latitude,
//         lng: pos.coords.longitude,
//       };

//       setCenter(next);
//       setLocationLabel("현재 위치");
//       setLocationSource("CURRENT");
//     });
//   }, []);
//   // 집 기준
//   const moveToHomeLocation = useCallback(() => {
//     if (!homeLat || !homeLng) return;

//     setCenter({ lat: homeLat, lng: homeLng });
//     setLocationLabel(addressRoad || "우리 집");
//     setLocationSource("HOME");
//   }, [homeLat, homeLng, addressRoad]);

//   /** 기준 위치 or 반경 변경 시 API 호출 */
//   useEffect(() => {
//     const fetchPosts = async () => {
//       const res = await mapApi.getNearByPosts({
//         latitude: center.lat,
//         longitude: center.lng,
//         radius: radiusKm * 1000,
//         type: findType,
//       });

//       setAllPosts(res.nearByPosts);
//     };

//     fetchPosts();
//   }, [center, radiusKm, findType]);

//   /** 프론트에서 반경 필터링 (이중 안전망) */
//   useEffect(() => {
//     const next = allPosts.filter((post) => {
//       const d = getDistanceMeter(
//         center.lat,
//         center.lng,
//         post.latitude,
//         post.longitude
//       );

//       return d <= radiusKm * 1000;
//     });

//     setFilteredPosts(next);
//   }, [allPosts, center, radiusKm]);

//   /** 최초 진입 시 현재 위치 */
//   // useEffect(() => {
//   //   moveToCurrentLocation();
//   // }, [moveToCurrentLocation]);

//   return (
//     <Container>
//       <HeaderWrapper>
//         <Header title="동네지도" showBack onBack={() => navigate(-1)} />
//       </HeaderWrapper>

//       <Content>
//         <MapBasePage center={center} radius={radiusKm * 1000} />
//       </Content>

//       <BottomSheetWrapper>
//         <MapDisabledBottomSheet
//           onClickCurrentLocation={moveToCurrentLocation}
//           locationLabel={locationLabel}
//           radius={radiusKm}
//           onChangeRadius={setRadiusKm}
//         />
//       </BottomSheetWrapper>
//     </Container>
//   );
// };

// export default MapDisabledPage;

// const Container = styled.div`
//   background-color: ${({ theme }) => theme.color.white};
//   height: 100vh;
//   overflow: hidden;
//   position: relative;
// `;

// const HeaderWrapper = styled.div`
//   width: 100%;
//   padding: 0 16px;
//   box-sizing: border-box;
//   height: ${HEADER_HEIGHT_REM};
// `;

// const Content = styled.div`
//   position: absolute;
//   top: ${HEADER_HEIGHT_REM};
//   left: 0;
//   width: 100%;
//   height: calc(100vh - ${HEADER_HEIGHT_REM});
// `;

// const BottomSheetWrapper = styled.div`
//   position: fixed;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   z-index: 999;
//   pointer-events: none;
// `;

import { useRef } from "react";
import { Map, MapMarker, useKakaoLoader, Circle } from "react-kakao-maps-sdk";
import styled from "styled-components";
import type { PostItem } from "../../../types/post.type";

import CurrentLocationImage from "../components/images/current-location-red-with-radius.svg";

interface Props {
  center: { lat: number; lng: number };
  radius: number; // meter
  markers: PostItem[];
}

const pxToRem = (px: number) => `${px / 16}rem`;
const HEADER_HEIGHT_REM = pxToRem(73);

const MapBasePage = ({ center, radius, markers }: Props) => {
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
        {/* ✅ 기준 위치(집/현재 위치) 마커 */}
        <MapMarker
          position={center}
          image={{ src: CurrentLocationImage, size: { width: 45, height: 45 } }}
        />

        {/* ✅ 반경 원 */}
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

        {/* ✅ 반경 내 게시물 마커 */}
        {markers.map((post) => (
          <MapMarker
            key={post.postId}
            position={{ lat: post.latitude, lng: post.longitude }}
            title={post.title}
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
  bottom: 0;
  z-index: 0;
`;
