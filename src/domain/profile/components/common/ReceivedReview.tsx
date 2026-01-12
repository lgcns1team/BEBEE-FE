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

const ReceivedReview = () => {
  const { profile, isLoading } = useMemberStore();

  if (isLoading || !profile) return null;

  const items = profile.reviews ?? [];

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