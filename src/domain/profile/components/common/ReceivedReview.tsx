import styled from "styled-components";
import ReviewBadge from "../../../../components/ReviewBadge";
import { useMemberStore } from "../../../../store/useMemberStore";
import { useOtherMemberStore } from "../../store/useOtherMemberStore";
import { useEffect, useMemo, useState } from "react";
import {
  getReviewKeywords,
  type ReviewKeyword,
} from "../../../../api/reviewApi";

type Mode = "me" | "other";

interface Props {
  mode: Mode;
}

const ReceivedReview = ({ mode }: Props) => {
  
  const myStore = useMemberStore();
  const otherStore = useOtherMemberStore();

  const profile = mode === "me" ? myStore.member : otherStore.profile;

  const isLoading = mode === "me" ? myStore.isLoading : otherStore.isLoading;

  const [keywords, setKeywords] = useState<ReviewKeyword[]>([]);
  useEffect(() => {
    console.log("profile", profile);
    console.log("reviews", profile?.reviews);
  });
 
  useEffect(() => {
    getReviewKeywords()
      .then((res) => setKeywords(res.keywords ?? []))
      .catch((e) => console.error("리뷰 키워드 조회 실패:", e));
  }, []);

  /** keywordId → keyword 매핑 */
  const keywordMap = useMemo(() => {
    const map = new Map<number, ReviewKeyword>();
    keywords.forEach((k) => map.set(k.keywordId, k));
    return map;
  }, [keywords]);

  /** 화면에 표시할 리뷰 목록 */
  const items = useMemo(() => {
    if (!profile || !profile.reviews?.length) return [];

    return profile.reviews
      .map((review) => {
        const keyword = keywordMap.get(review.keywordId);
        if (!keyword) return null;

        if (mode === "other" && !keyword.isPositive) return null;

        return {
          keywordId: review.keywordId,
          description: keyword.description,
          count: review.count,
        };
      })
      .filter(Boolean) as {
      keywordId: number;
      description: string;
      count: number;
    }[];
  }, [profile, keywordMap, mode]);

  if (isLoading || !profile || items.length === 0) return null;

  return (
    <Container>
      <Title>받은 후기</Title>

      <BadgeWrap>
        {items.map((item) => (
          <ReviewBadge key={item.keywordId}>
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
