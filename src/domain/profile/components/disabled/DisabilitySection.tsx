// import styled from "styled-components";
// import { useProfileStore } from "../../../../store/useProfileStore";

// interface Props {
//   profileId?: number;
// }

// const DisabilitySection = ({ profileId }: Props) => {
//   const { disabledProfiles } = useProfileStore();
//   const profile = disabledProfiles.find((p) => p.memberId === profileId);
//   return (
//     <Description>
//       <Title>이런 불편함이 있어요</Title>

//       <DisabilityType>
//         <span>{profile?.disabilityType}</span>
//       </DisabilityType>

//       <TypeDescription>
//         <span>{profile?.description}</span>
//       </TypeDescription>
//     </Description>
//   );
// };

// export default DisabilitySection;

// const Description = styled.div`
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

// const DisabilityType = styled.div`
//   font-size: ${({ theme }) => theme.size.sm};
//   background-color: ${({ theme }) => theme.color.subColor};
//   border-radius: ${({ theme }) => theme.borderRadius.md};
//   padding: 8px 12px;
// `;

// const TypeDescription = styled.div`
//   font-size: ${({ theme }) => theme.size.sm};
//   border: 1px solid ${({ theme }) => theme.color.main};
//   border-radius: ${({ theme }) => theme.borderRadius.md};
//   padding: 12px;
// `;
