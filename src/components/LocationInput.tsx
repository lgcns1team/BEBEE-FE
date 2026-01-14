import React, { useState, useEffect, useRef } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { useKakaoLoader, Map as KakaoMap, MapMarker } from "react-kakao-maps-sdk";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import BaseInput from "./BaseInput";
import {
  SearchIconWrapper,
  LocationInputWrapper,
  InputBox,
} from "../styles/inputStyles";
import styled from "styled-components";

interface LocationInputProps {
  inputLabel?: string;
  infoText?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect: (loc: {
    address: string;
    code: string;
    lat: number;
    lng: number;
  }) => void;
  required?: boolean;
  placeholder?: string;
}

const LocationInput = ({
  inputLabel,
  infoText,
  value,
  onSelect,
  ...rest
}: LocationInputProps) => {
  const [keyword, setKeyword] = useState(value || "");
  const [results, setResults] = useState<any[]>([]);
  const [ps, setPs] = useState<any>(null);
  const [geocoder, setGeocoder] = useState<any>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 37.5665,
    lng: 126.9780,
  }); // 서울시청 기본 위치
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [pendingAddress, setPendingAddress] = useState<{
    address: string;
    code: string;
    lat: number;
    lng: number;
  } | null>(null);
  const isUserTypingRef = useRef(false);
  const prevValueRef = useRef<string | undefined>(value);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const mapReadyRef = useRef(false);


  // 1. 카카오 맵 SDK 로드 (services 라이브러리 포함)
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY || "",
    libraries: ['services'], // Geocoder와 Places를 사용하기 위해 필요
  });

  // 2. 카카오 장소 검색 객체 및 Geocoder 초기화 (SDK 로드 후)
  useEffect(() => {
    const hasWindowKakao = !!window.kakao;
    const hasMaps = !!(window.kakao && window.kakao.maps);
    const hasServices = !!(window.kakao && window.kakao.maps && window.kakao.maps.services);

    console.log("📊 SDK 로드 상태:", {
      loading,
      error,
      hasWindowKakao,
      hasMaps,
      hasServices,
      windowKakaoKeys: window.kakao ? Object.keys(window.kakao) : [],
      mapsKeys: (window.kakao && window.kakao.maps) ? Object.keys(window.kakao.maps) : []
    });

    if (error) {
      console.error("❌ 카카오 맵 SDK 로드 실패:", error);
      console.error("💡 해결 방법:");
      console.error("1. .env 파일에 VITE_KAKAO_MAP_KEY가 설정되어 있는지 확인");
      console.error("2. API 키가 올바른지 확인 (카카오 개발자 콘솔에서 JavaScript 키 확인)");
      console.error("3. 카카오 개발자 콘솔에서 '카카오맵' 제품이 활성화되어 있는지 확인");
      console.error("4. 플랫폼 설정에서 Web 플랫폼이 등록되어 있는지 확인");
    }

    if (!loading && !error && hasWindowKakao && hasMaps && hasServices) {
      console.log("✅ SDK 로드 완료, Places와 Geocoder 초기화");
      setPs(new window.kakao.maps.services.Places());
      setGeocoder(new window.kakao.maps.services.Geocoder());
    } else if (!loading && !error && hasWindowKakao && hasMaps && !hasServices) {
      console.error("❌ Services 라이브러리가 로드되지 않았습니다.");
      console.error("💡 해결 방법:");
      console.error("1. react-kakao-maps-sdk의 useKakaoLoader가 자동으로 services를 포함하지만,");
      console.error("2. 수동으로 로드하는 경우 libraries=services를 추가해야 합니다.");
      console.error("3. 예: //dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KEY&libraries=services");
    } else if (!loading && !error && hasWindowKakao && !hasMaps) {
      console.error("❌ window.kakao.maps가 없습니다.");
    }
  }, [loading, error]);

  // 현재 위치 가져오기
  useEffect(() => {
    if (isMapModalOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // 위치 권한 거부 시 기본 위치 사용
          console.log("위치 권한이 거부되었습니다.");
        }
      );
    }
  }, [isMapModalOpen]);

  // 맵 모달이 열릴 때 SDK 준비 상태 확인
  useEffect(() => {
    if (isMapModalOpen && !loading && !error) {
      mapReadyRef.current = false;
      // SDK가 완전히 로드되었는지 확인
      intervalRef.current = window.setInterval(() => {
        if (window.kakao && window.kakao.maps && window.kakao.maps.Map) {
          setIsMapReady(true);
          mapReadyRef.current = true;
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }
      }, 100);

      // 최대 5초 후 타임아웃
      timeoutRef.current = window.setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (!mapReadyRef.current) {
          console.error("카카오 맵 SDK 로드 타임아웃");
        }
      }, 5000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }
  }, [isMapModalOpen, loading, error]);

  // 3. value prop이 변경되면 keyword state 동기화
  // 사용자가 입력 중이 아닐 때만 동기화
  useEffect(() => {
    // value가 변경되었고, 사용자가 입력 중이 아니며, 이전 값과 다를 때만 업데이트
    if (
      value !== undefined &&
      value !== prevValueRef.current &&
      !isUserTypingRef.current
    ) {
      setKeyword(value);
      prevValueRef.current = value;
    }
  }, [value]);

  // 4. 키워드 검색 실행 함수
  const searchPlaces = (searchKeyword: string) => {
    if (!ps) return;
    if (!searchKeyword.trim()) {
      setResults([]);
      return;
    }

    ps.keywordSearch(searchKeyword, (data: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setResults(data);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        setResults([]);
      }
    });
  };

  // 5. 입력창 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    isUserTypingRef.current = true;
    setKeyword(val);
    searchPlaces(val); // 실시간 검색
    // onChange prop이 있으면 호출
    if (rest.onChange) {
      rest.onChange(e);
    }
    // 입력이 끝난 후 플래그 리셋 (약간의 지연 후)
    setTimeout(() => {
      isUserTypingRef.current = false;
    }, 100);
  };

  // 6. 장소 선택 핸들러
  const handleSelectPlace = (place: any) => {
    const selectedAddress = place.place_name;
    const lat = Number(place.y);
    const lng = Number(place.x);

    isUserTypingRef.current = false;

    // 만약 geocoder가 있으면 행정동/법정동 코드를 찾아옵니다.
    if (geocoder) {
      geocoder.coord2RegionCode(lng, lat, (result: any, status: any) => {
        let bCode = "";
        if (status === window.kakao.maps.services.Status.OK) {
          // 법정동(B) 코드를 우선적으로 찾습니다.
          const legalRegion = result.find((region: any) => region.region_type === 'B');
          if (legalRegion) {
            bCode = legalRegion.code;
          }
        }

        onSelect({
          address: selectedAddress,
          code: bCode,
          lat: lat,
          lng: lng,
        });
      });
    } else {
      // geocoder가 없는 경우(드문 경우) 일단 좌표만이라도 보냅니다.
      onSelect({
        address: selectedAddress,
        code: "",
        lat: lat,
        lng: lng,
      });
    }

    console.log("📍 선택된 장소 원본:", place);
    setKeyword(selectedAddress);
    prevValueRef.current = selectedAddress;
    setResults([]);
  };

  // 7. 맵 클릭 핸들러 - 좌표를 주소로 변환
  const handleMapClick = (_t: any, mouseEvent: kakao.maps.event.MouseEvent) => {
    console.log("🗺️ 맵 클릭됨", {
      geocoder: !!geocoder,
      windowKakao: !!window.kakao,
      loading,
      error,
      hasMaps: !!(window.kakao && window.kakao.maps),
      hasServices: !!(window.kakao && window.kakao.maps && window.kakao.maps.services)
    });

    // SDK 로드 상태 확인
    if (loading) {
      console.warn("⚠️ 카카오 맵 SDK가 아직 로딩 중입니다.");
      setPendingAddress({
        address: "지도를 불러오는 중입니다. 잠시 후 다시 시도해주세요.",
        code: "",
        lat: 0,
        lng: 0,
      });
      return;
    }

    if (error) {
      console.error("❌ 카카오 맵 SDK 로드 실패:", error);
      setPendingAddress({
        address: "지도를 불러올 수 없습니다. API 키를 확인해주세요.",
        code: "",
        lat: 0,
        lng: 0,
      });
      return;
    }

    // window.kakao가 없으면 에러 표시
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.error("❌ 카카오 맵 SDK가 로드되지 않았습니다.", {
        hasWindowKakao: !!window.kakao,
        hasMaps: !!(window.kakao && window.kakao.maps),
        hasServices: !!(window.kakao && window.kakao.maps && window.kakao.maps.services),
        apiKey: import.meta.env.VITE_KAKAO_MAP_KEY ? "설정됨" : "설정 안됨"
      });
      setPendingAddress({
        address: "지도를 불러올 수 없습니다. API 키 설정을 확인해주세요.",
        code: "",
        lat: 0,
        lng: 0,
      });
      return;
    }

    // geocoder가 없으면 새로 생성 (항상 새로 생성해도 무방)
    const currentGeocoder = geocoder || new window.kakao.maps.services.Geocoder();
    if (!geocoder) {
      setGeocoder(currentGeocoder);
    }

    const latlng = mouseEvent.latLng;
    const lat = latlng.getLat();
    const lng = latlng.getLng();

    console.log("📍 클릭한 좌표:", { lat, lng });

    setSelectedPosition({ lat, lng });
    // 주소 변환 중임을 표시하기 위해 임시로 pendingAddress를 설정 (로딩 상태)
    setPendingAddress({
      address: "주소 변환 중...",
      code: "",
      lat,
      lng,
    });

    // 좌표를 주소로 변환
    currentGeocoder.coord2Address(lng, lat, (result: any, status: any) => {
      console.log("🔍 주소 변환 결과:", { status, result, statusOK: window.kakao.maps.services.Status.OK });

      if (status === window.kakao.maps.services.Status.OK && result && result.length > 0) {
        const address = result[0].address;
        const roadAddress = result[0].road_address;

        let fullAddress = "";
        if (roadAddress) {
          // 도로명 주소가 있으면 도로명 주소 사용
          fullAddress = roadAddress.address_name;
          if (roadAddress.building_name) {
            fullAddress += ` ${roadAddress.building_name}`;
          }
        } else if (address) {
          // 지번 주소 사용
          fullAddress = address.address_name;
        } else {
          console.warn("⚠️ 주소 정보를 찾을 수 없습니다.");
          fullAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }

        console.log("✅ 변환된 주소:", fullAddress);

        // 주소 확인 팝업을 위해 pendingAddress에 저장 (바로 입력하지 않음)
        setPendingAddress({
          address: fullAddress,
          code: address?.b_code || "",
          lat,
          lng,
        });
      } else {
        console.error("❌ 주소 변환 실패:", status);
        // 주소 변환 실패 시에도 좌표라도 표시
        const coordAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setPendingAddress({
          address: coordAddress,
          code: "",
          lat,
          lng,
        });
      }
    });
  };

  // 주소 확인 버튼 클릭 핸들러
  const handleConfirmAddress = () => {
    if (!pendingAddress) return;

    // onSelect 콜백 호출
    onSelect(pendingAddress);

    isUserTypingRef.current = false;
    setKeyword(pendingAddress.address);
    prevValueRef.current = pendingAddress.address;
    setPendingAddress(null);
    setIsMapModalOpen(false);
    setResults([]);
  };

  // 주소 확인 취소 핸들러
  const handleCancelAddress = () => {
    setPendingAddress(null);
    setSelectedPosition(null);
  };

  // 8. 맵 모달 열기
  const handleOpenMap = () => {
    if (loading || error) {
      console.warn("카카오 맵 SDK가 아직 로드되지 않았습니다.");
      return;
    }
    setIsMapModalOpen(true);
  };

  // 9. 맵 모달 닫기
  const handleCloseMap = () => {
    setIsMapModalOpen(false);
    setSelectedPosition(null);
    setPendingAddress(null);
    setIsMapReady(false);
  };

  // SDK 로딩 중이거나 에러 발생 시 처리
  if (loading) {
    return (
      <BaseInput label={inputLabel} infoText={infoText} {...rest}>
        <LocationInputWrapper style={{ position: "relative" }}>
          <InputBox
            placeholder="지도 로딩 중..."
            disabled
            {...rest}
          />
        </LocationInputWrapper>
      </BaseInput>
    );
  }

  if (error) {
    return (
      <BaseInput label={inputLabel} infoText={infoText} {...rest}>
        <LocationInputWrapper style={{ position: "relative" }}>
          <InputBox
            placeholder="지도 로드 실패"
            disabled
            {...rest}
          />
        </LocationInputWrapper>
      </BaseInput>
    );
  }

  return (
    <>
      <BaseInput label={inputLabel} infoText={infoText} {...rest}>
        <LocationInputWrapper style={{ position: "relative" }}>
          <SearchIconWrapper>
            <IoIosSearch size={20} />
          </SearchIconWrapper>
          <InputBox
            placeholder="예: 동아아파트 정문"
            value={keyword}
            onChange={handleInputChange}
            {...rest}
          />
          <MapButton type="button" onClick={handleOpenMap} disabled={loading || !!error}>
            <IoLocationOutline size={20} />
          </MapButton>

          {/* 검색 결과 리스트 표시 */}
          {results.length > 0 && (
            <SearchResultList>
              {results.map((place, idx) => (
                <SearchResultItem
                  key={idx}
                  onClick={() => handleSelectPlace(place)}
                >
                  <div className="place-name">{place.place_name}</div>
                  <div className="address-name">{place.address_name}</div>
                </SearchResultItem>
              ))}
            </SearchResultList>
          )}
        </LocationInputWrapper>
      </BaseInput>

      {/* 맵 모달 */}
      {isMapModalOpen && !loading && !error && (
        <MapModalPortal>
          <AnimatePresence>
            <ModalOverlay>
              <Dim
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseMap}
              />
              <ModalContainer
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <ModalHeader>
                  <ModalTitle>지도에서 위치 선택</ModalTitle>
                  <CloseButton onClick={handleCloseMap}>✕</CloseButton>
                </ModalHeader>
                <MapContainer>
                  {isMapReady && window.kakao && window.kakao.maps ? (
                    <KakaoMap
                      center={mapCenter}
                      style={{ width: "100%", height: "100%" }}
                      level={3}
                      draggable
                      zoomable
                      onClick={handleMapClick}
                      onCreate={(map) => {
                        mapRef.current = map;
                        // 맵이 생성된 후 relayout 호출하여 제대로 렌더링되도록 함
                        setTimeout(() => {
                          if (map) {
                            map.relayout();
                          }
                        }, 100);
                      }}
                    >
                      {selectedPosition && (
                        <MapMarker
                          position={selectedPosition}
                          clickable={false}
                        />
                      )}
                    </KakaoMap>
                  ) : (
                    <MapLoadingContainer>
                      <MapLoadingText>지도를 불러오는 중...</MapLoadingText>
                    </MapLoadingContainer>
                  )}
                </MapContainer>
                <ModalFooter>
                  {pendingAddress ? (
                    <>
                      <AddressInfoBox>
                        <AddressLabel>선택한 주소</AddressLabel>
                        <AddressValue>
                          {pendingAddress.address === "주소 변환 중..."
                            ? "주소를 변환하는 중입니다..."
                            : pendingAddress.address}
                        </AddressValue>
                      </AddressInfoBox>
                      {pendingAddress.address !== "주소 변환 중..." && (
                        <ConfirmButtonGroup>
                          <CancelButton onClick={handleCancelAddress}>취소</CancelButton>
                          <ConfirmButton onClick={handleConfirmAddress}>확인</ConfirmButton>
                        </ConfirmButtonGroup>
                      )}
                    </>
                  ) : (
                    <FooterText>지도를 클릭하여 위치를 선택하세요</FooterText>
                  )}
                </ModalFooter>
              </ModalContainer>
            </ModalOverlay>
          </AnimatePresence>
        </MapModalPortal>
      )}
    </>
  );
};

export default LocationInput;

// 스타일
const SearchResultList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  z-index: 100;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SearchResultItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  &:hover {
    background: #f9f9f9;
  }
  .place-name {
    font-weight: bold;
    font-size: 14px;
  }
  .address-name {
    font-size: 12px;
    color: #666;
  }
`;

const MapButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  z-index: 10;

  &:hover {
    color: #155DFC;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MapModalPortal = ({ children }: { children: React.ReactNode }) => {
  return createPortal(children, document.body);
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dim = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
`;

const ModalContainer = styled(motion.div)`
  position: relative;
  width: 90%;
  max-width: 500px;
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  z-index: 1001;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #000;
  }
`;

const MapContainer = styled.div`
  width: 100%;
  min-height: 400px;
  height: 400px;
  position: relative;
  overflow: hidden;
`;

const MapLoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
`;

const MapLoadingText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
`;

const ModalFooter = styled.div`
  padding: 12px 20px;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
  text-align: center;
  word-break: keep-all;
  line-height: 1.5;
`;

const AddressInfoBox = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 8px;
`;

const AddressLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
`;

const AddressValue = styled.div`
  font-size: 16px;
  color: #000;
  font-weight: 600;
  word-break: keep-all;
  line-height: 1.5;
`;

const ConfirmButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const ConfirmButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  background: #155DFC;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #0d4fc7;
  }

  &:active {
    background: #0a3fa3;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e0e0e0;
  }

  &:active {
    background: #d0d0d0;
  }
`;
