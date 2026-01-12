// import styled from "styled-components";
// import ReviewBadge from "../../../../components/ReviewBadge";
// import { useProfileStore } from "../../../../store/useProfileStore";

// interface Props {
//   profileId?: number;
// }

// const ReceivedReview = ({ profileId }: Props) => {
//   const { role, disabledProfiles, helperProfiles } = useProfileStore();

//   const profile =
//     role === "DISABLED"
//       ? disabledProfiles.find((p) => p.memberId === profileId)
//       : helperProfiles.find((p) => p.memberId === profileId);

//   if (!profile) return null;
//   const items = profile.receivedReviews ?? [];

//   return (
//     <Container>
//       <Title>받은 후기</Title>

//       <BadgeWrap>
//         {items.map((review, idx) => (
//           <ReviewBadge key={`${review}-${idx}`}>{review}</ReviewBadge>
//         ))}
//       </BadgeWrap>
//     </Container>
//   );
// };

// export default ReceivedReview;
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
import { useEffect, useMemo, useState } from "react";
import { getReviewKeywords, ReviewKeyword } from "../../../../api/reviewApi";

type Mode = "me" | "other";

interface Props {
  mode: Mode
}


const ReceivedReview = ({mode} : Props) => {
  const { member, isLoading } = useMemberStore();
  const [keywords, setKeywords] = useState<ReviewKeyword[]>([]);

  useEffect(() =>{
    getReviewKeywords().then((res) => setKeywords(res.keywords ?? []))
    .catch((e) => console.error("리뷰 키워드 조회 실패: ", e))
  },[])

  const keywordMap = useMemo(() =>{
    const map = new Map<number, ReviewKeyword>();
    keywords.forEach((k) => map.set(k.keywordId, k));
    return map;
  }, [keywords]);
  
  const items = useMemo(() => {
    if (!member?. || profile.reviews.length === 0) return [];

    return profile.reviews
      .map((r) => {
        const kw = keywordMap.get(r.keywordId);
        if (!kw) return null;

        // ✅ 타인 프로필: 긍정만
        if (mode === "other" && kw.isPositive === false) return null;

        return {
          keywordId: r.keywordId,
          description: kw.description,
          isPositive: kw.isPositive,
          count: r.count,
        };
      })
      .filter(Boolean) as Array<{
      keywordId: number;
      description: string;
      isPositive: boolean;
      count: number;
    }>;
  }, [profile, keywordMap, mode]);

  if (isLoading || !profile) return null;
  if (items.length === 0) return null;
  return (
    <Container>
      <Title>받은 후기</Title>

      <BadgeWrap>
        {items.map((review, idx) => (
          <ReviewBadge key={`${review}-${idx}`}>
            {review}
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