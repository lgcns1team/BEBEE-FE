// import styled from "styled-components";
// import ReviewBadge from "../../../../components/ReviewBadge";
// import { useMemberStore } from "../../../../store/useMemberStore";
// import { useOtherMemberStore } from "../../store/useOtherMemberStore";
// import { useEffect, useMemo, useState } from "react";
// import {
//   getReviewKeywords,
//   type ReviewKeyword,
// } from "../../../../api/reviewApi";

// type Mode = "me" | "other";

// interface Props {
//   mode: Mode;
// }

// const ReceivedReview = ({ mode }: Props) => {
  
//   const myStore = useMemberStore();
//   const otherStore = useOtherMemberStore();

//   const profile = mode === "me" ? myStore.member : otherStore.profile;

//   const isLoading = mode === "me" ? myStore.isLoading : otherStore.isLoading;

//   const [keywords, setKeywords] = useState<ReviewKeyword[]>([]);
//    useEffect(() => {
//     getReviewKeywords()
//       .then((res: any) => {
//         const list: ReviewKeyword[] = res?.keywords ?? res?.data?.keywords ?? [];
//         setKeywords(list);
//       })
//       .catch((e) => console.error("리뷰 키워드 조회 실패:", e));
//   }, []);

//   // ✅ keywordId -> keyword 매핑 (string 기준)
//   const keywordMap = useMemo(() => {
//     const map = new Map<string, ReviewKeyword>();
//     keywords.forEach((k: any) => {
//       // keywordId가 number로 오는 경우도 대비해서 string으로 변환
//       map.set(String(k.keywordId), k);
//     });
//     return map;
//   }, [keywords]);

//   // ✅ 화면에 표시할 리뷰 목록
//   const items = useMemo(() => {
//     if (!profile?.reviews?.length) return [];

//     return profile.reviews
//       .map((review: any) => {
//         const keywordId = String(review.keywordId);
//         const keyword = keywordMap.get(keywordId);

//         if (!keyword) return null;

//         // ✅ other 모드에서는 긍정 키워드만 노출
//         if (mode === "other" && !keyword.isPositive) return null;

//         return {
//           keywordId,
//           description: keyword.description,
//           count: review.count,
//         };
//       })
//       .filter(Boolean) as {
//       keywordId: string;
//       description: string;
//       count: number;
//     }[];
//   }, [profile, keywordMap, mode]);

//   if (isLoading || !profile || items.length === 0) return null;

//   return (
//     <Container>
//       <Title>받은 후기</Title>

//       <BadgeWrap>
//         {items.map((item) => (
//           <ReviewBadge key={item.keywordId}>
//             {item.description}
//             {item.count > 1 && ` · ${item.count}`}
//           </ReviewBadge>
//         ))}
//       </BadgeWrap>
//     </Container>
//   );
// };

// export default ReceivedReview;

// /* ================= styled ================= */

// const Container = styled.div`
//   background-color: ${({ theme }) => theme.color.white};
//   border-radius: ${({ theme }) => theme.borderRadius.lg};
//   width: 100%;
//   margin-top: 20px;
//   padding: 20px;
//   display: flex;
//   flex-direction: column;
//   gap: 12px;
// `;

// const Title = styled.div`
//   font-size: ${({ theme }) => theme.size.md};
//   font-weight: ${({ theme }) => theme.weight.bold};
// `;

// const BadgeWrap = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 8px;
// `;
// import styled from "styled-components";
// import ReviewBadge from "../../../../components/ReviewBadge";
// import { useMemberStore } from "../../../../store/useMemberStore";
// import { useOtherMemberStore } from "../../store/useOtherMemberStore";
// import { useEffect, useMemo, useState } from "react";
// import {
//   getReviewKeywords,
//   type ReviewKeyword,
// } from "../../../../api/reviewApi";

// type Mode = "me" | "other";

// interface Props {
//   mode: Mode;
// }

// /** ✅ profile.reviews에서 쓰는 타입 (keywordId가 string일 수도 있어서 안전하게) */
// type ReviewCountItem = {
//   keywordId: string | number;
//   count: number;
// };

// const ReceivedReview = ({ mode }: Props) => {
//   const myStore = useMemberStore();
//   const otherStore = useOtherMemberStore();

//   const profile = mode === "me" ? myStore.member : otherStore.profile;
//   const isLoading = mode === "me" ? myStore.isLoading : otherStore.isLoading;

//   const [keywords, setKeywords] = useState<ReviewKeyword[]>([]);

//   /** ✅ 키워드 목록 조회 */
//   useEffect(() => {
//     getReviewKeywords()
//       .then((res) => {
//         const list = res?.keywords ?? [];
//         setKeywords(list);
//       })
//       .catch((e) => console.error("리뷰 키워드 조회 실패:", e));
//   }, []);

//   /** ✅ keywordId -> keyword 매핑 (항상 string 키로) */
//   const keywordMap = useMemo(() => {
//     const map = new Map<string, ReviewKeyword>();
//     keywords.forEach((k) => {
//       map.set(String(k.keywordId), k);
//     });
//     return map;
//   }, [keywords]);

//   /** ✅ 화면에 표시할 리뷰 목록 */
//   const items = useMemo(() => {
//     const reviews = (profile?.reviews ?? []) as ReviewCountItem[];
//     if (reviews.length === 0) return [];

//     return reviews
//       .map((review) => {
//         const keyword = keywordMap.get(String(review.keywordId));
//         if (!keyword) return null;

//         // ✅ other 모드에서는 긍정만 보여주기
//         if (mode === "other" && !keyword.isPositive) return null;

//         return {
//           keywordId: String(review.keywordId), // ✅ string 고정
//           description: keyword.description,
//           count: review.count ?? 1,
//         };
//       })
//       .filter(Boolean) as {
//       keywordId: string;
//       description: string;
//       count: number;
//     }[];
//   }, [profile, keywordMap, mode]); // ✅ React Compiler 경고 줄이려면 profile 전체를 deps로

//   if (isLoading || !profile) return null;
//   if (items.length === 0) return null;

//   return (
//     <Container>
//       <Title>받은 후기</Title>

//       <BadgeWrap>
//         {items.map((item) => (
//           <ReviewBadge key={item.keywordId}>
//             {item.description}
//             {item.count > 1 && ` · ${item.count}`}
//           </ReviewBadge>
//         ))}
//       </BadgeWrap>
//     </Container>
//   );
// };

// export default ReceivedReview;

// /* ================= styled ================= */

// const Container = styled.div`
//   background-color: ${({ theme }) => theme.color.white};
//   border-radius: ${({ theme }) => theme.borderRadius.lg};
//   width: 100%;
//   margin-top: 20px;
//   padding: 20px;
//   display: flex;
//   flex-direction: column;
//   gap: 12px;
// `;

// const Title = styled.div`
//   font-size: ${({ theme }) => theme.size.md};
//   font-weight: ${({ theme }) => theme.weight.bold};
// `;

// const BadgeWrap = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 8px;
// `;

// import styled from "styled-components";
// import ReviewBadge from "../../../../components/ReviewBadge";
// import { useMemberStore } from "../../../../store/useMemberStore";
// import { useOtherMemberStore } from "../../store/useOtherMemberStore";
// import { useMemo } from "react";

// type Mode = "me" | "other";

// interface Props {
//   mode: Mode;
// }

// // ✅ 서버 응답 reviews 구조에 맞춘 타입
// type ProfileReview = {
//   keywordId: number; // 서버는 number
//   description: string;
//   isPositive: boolean;
//   count: number;
// };

// const ReceivedReview = ({ mode }: Props) => {
//   const myStore = useMemberStore();
//   const otherStore = useOtherMemberStore();

//   const profile = mode === "me" ? myStore.member : otherStore.profile;
//   const isLoading = mode === "me" ? myStore.isLoading : otherStore.isLoading;

//   const items = useMemo(() => {
//     const reviews = (profile?.reviews ?? []) as ProfileReview[];
//     if (reviews.length === 0) return [];

//     // ✅ other 모드 = 긍정만
//     if (mode === "other") {
//       return reviews.filter((r) => r.isPositive);
//     }

//     return reviews;
//   }, [profile, mode]);

//   if (isLoading || !profile) return null;
//   if (items.length === 0) return null;

//   return (
//     <Container aria-label="받은 후기 목록입니다.">
//       <Title>받은 후기</Title>

//       <BadgeWrap>
//         {items.map((item) => (
//           <ReviewBadge key={String(item.keywordId)}>
//             {item.description}
//             {item.count > 1 && ` · ${item.count}`}
//           </ReviewBadge>
//         ))}
//       </BadgeWrap>
//     </Container>
//   );
// };

// export default ReceivedReview;

// /* ================= styled ================= */

// const Container = styled.div`
//   background-color: ${({ theme }) => theme.color.white};
//   border-radius: ${({ theme }) => theme.borderRadius.lg};
//   width: 100%;
//   margin-top: 20px;
//   padding: 20px;
//   display: flex;
//   flex-direction: column;
//   gap: 12px;
// `;

// const Title = styled.div`
//   font-size: ${({ theme }) => theme.size.md};
//   font-weight: ${({ theme }) => theme.weight.bold};
// `;

// const BadgeWrap = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 8px;
// `;

import styled from "styled-components";
import ReviewBadge from "../../../../components/ReviewBadge";
import { useMemberStore } from "../../../../store/useMemberStore";
import { useOtherMemberStore } from "../../store/useOtherMemberStore";
import { useEffect, useMemo } from "react";
import type { ReviewCount } from "../../../../types/member.type";

type Mode = "me" | "other";

interface Props {
  mode: Mode;
}

const ReceivedReview = ({ mode }: Props) => {
  const myStore = useMemberStore();
  const otherStore = useOtherMemberStore();

  // ✅ mode에 따라 profile 선택
  const profile = mode === "me" ? myStore.member : otherStore.profile;
  const isLoading = mode === "me" ? myStore.isLoading : otherStore.isLoading;

  // ✅ mode="me" 인데 member 데이터가 없으면 자동 fetch
  useEffect(() => {
    if (mode !== "me") return;
    if (myStore.member) return;
    if (myStore.isLoading) return;

    myStore.fetchMember();
  }, [mode, myStore]);

  // ✅ 화면에 표시할 리뷰 목록
  const items = useMemo(() => {
    const reviews = (profile?.reviews ?? []) as ReviewCount[];
    if (reviews.length === 0) return [];

    // other 모드에서는 긍정만 노출
    if (mode === "other") {
      return reviews.filter((r) => r.isPositive);
    }

    return reviews;
  }, [profile, mode]);

  if (isLoading || !profile) return null;
  if (items.length === 0) return null;

  return (
    <Container aria-label="받은 후기 목록입니다.">
      <Title>받은 후기</Title>

      <BadgeWrap>
        {items.map((item) => (
          <ReviewBadge key={String(item.keywordId)}>
            {item.description}
            {item.count > 1 && ` · ${item.count}`}
          </ReviewBadge>
        ))}
      </BadgeWrap>
    </Container>
  );
};

export default ReceivedReview;

/* ================= styled ================= */

const Container = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 100%;
  margin-top: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.bold};
`;

const BadgeWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;