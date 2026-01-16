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

  const profile = mode === "me" ? myStore.member : otherStore.profile;
  const isLoading = mode === "me" ? myStore.isLoading : otherStore.isLoading;

  useEffect(() => {
    if (mode !== "me") return;
    if (myStore.member) return;
    if (myStore.isLoading) return;

    myStore.fetchMember();
  }, [mode, myStore]);

  const items = useMemo(() => {
    const reviews = (profile?.reviews ?? []) as ReviewCount[];
    if (reviews.length === 0) return [];

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

  max-height: 240px;
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.bold};
  flex-shrink: 0;
`;

const BadgeWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;
