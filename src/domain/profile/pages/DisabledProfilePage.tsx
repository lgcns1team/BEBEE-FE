// import styled from "styled-components";
// import { useNavigate, useParams } from "react-router-dom";

// import Layout from "../../../components/Layout";
// import Header from "../../../components/Header";

// import DisabilitySection from "../components/disabled/DisabilitySection";
// import ReceivedReview from "../components/common/ReceivedReview";
// import ProfileHelpPostCard from "../components/disabled/ProfileHelpPostCard";
// import ProfileDetailSection from "../components/common/ProfileDetailSection";

// import { usePostStore } from "../../../store/usePostStore";

// const DisabledProfilePage = () => {
//   const navigate = useNavigate();
//   const { profileId } = useParams<{ profileId: string }>();

//   const posts = usePostStore((state) => state.posts);

//   if (!profileId) {
//     return null;
//   }

//   return (
//     <Layout bg>
//       <Header title="프로필 정보" onBack={() => navigate(-1)} bg showBack />

//       <ProfileDetailSection />

//       <DisabilitySection profileId={Number(profileId)} />

//       {/* <ReceivedReview  /> */}

//       <HelpPostContainer>
//         <HelpPostHeader>
//           <HelpLabel>
//             <Label>도움 요청글</Label>
//             <Count>{posts.length}</Count>
//           </HelpLabel>
//           <SeeMore>더보기</SeeMore>
//         </HelpPostHeader>

//         <Grid>
//           {posts.slice(0, 2).map((post) => (
//             <ProfileHelpPostCard key={post.postId} id={post.postId} />
//           ))}
//         </Grid>
//       </HelpPostContainer>
//     </Layout>
//   );
// };

// export default DisabledProfilePage;

// /* ================= styled ================= */

// const Grid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   gap: 16px;
//   width: 100%;
// `;

// const HelpPostContainer = styled.div`
//   background: ${({ theme }) => theme.color.white};
//   border-radius: ${({ theme }) => theme.borderRadius.lg};
//   width: 100%;
//   padding: 20px;
//   margin: 20px 0 16px 0;
// `;

// const HelpPostHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 16px;
// `;

// const HelpLabel = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
// `;

// const Label = styled.span`
//   font-size: ${({ theme }) => theme.size.md};
//   font-weight: ${({ theme }) => theme.weight.bold};
// `;

// const Count = styled.span`
//   font-size: ${({ theme }) => theme.size.md};
//   font-weight: ${({ theme }) => theme.weight.bold};
// `;

// const SeeMore = styled.span`
//   font-size: ${({ theme }) => theme.size.sm};
//   color: ${({ theme }) => theme.color.subText2};
// `;
