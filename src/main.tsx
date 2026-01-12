import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Kakao Map SDK 동적 로드
const loadKakaoMapScript = () => {
  const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY;

  console.log('=== Kakao Map SDK Loading ===');
  console.log('VITE_KAKAO_MAP_KEY:', kakaoMapKey);

  if (!kakaoMapKey) {
    console.warn('⚠️ VITE_KAKAO_MAP_KEY is not defined in .env file!');
    return;
  }

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&libraries=services,clusterer`;
  script.async = true;

  script.onload = () => {
    console.log('✅ Kakao Map SDK loaded successfully');
  };

  script.onerror = () => {
    console.error('❌ Failed to load Kakao Map SDK');
  };

  document.head.appendChild(script);
};

// 스크립트 로드
loadKakaoMapScript();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
