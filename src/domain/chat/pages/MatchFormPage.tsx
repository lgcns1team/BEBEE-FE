// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// import DayHelpForm from "../components/matchConfirm/DayHelpForm";
// import LongHelpForm from "../components/matchConfirm/LongHelpForm";
// import BaseLongButton from "../../../components/BaseLongButton";
// import LocationInput from "../../../components/LocationInput";
// import type { MatchPost } from "../components/matchConfirm/matchPost";
// import GeneralInput from "../../../components/GeneralInput";
// import Layout from "../../../components/Layout";
// import Header from "../../../components/Header";
// import HelpTagDropDown from "../../../components/HelpTagDropDown";

// // 목업 데이터
// const MOCK_POST: MatchPost = {
//   type: "long",
//   title: "마트 장봐주실 분 구해요",
//   reward: 15000,
//   location: "서울시 강남구 역삼동",

//   // 하루도움 데이터 채워둠
//   date: new Date(),
//   startTime: new Date(new Date().setHours(10, 0)),
//   endTime: new Date(new Date().setHours(12, 0)),
// };

// const typeLabelMap = {
//   day: "하루도움",
//   long: "지속도움",
// } as const;

// const MatchFormPage = () => {
//   const { chatId } = useParams();
//   const navigate = useNavigate();
//   const [editedPost, setEditedPost] = useState<MatchPost>(MOCK_POST);
//   const [selectedTags, setSelectedTags] = useState<string[]>([]);

//   const updateField = <K extends keyof MatchPost>(
//     key: K,
//     value: MatchPost[K]
//   ) => {
//     setEditedPost((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const handleConfirm = () => {
//     // MatchPost 데이터를 MatchResultCard에 맞는 형식으로 변환
//     const matchData = {
//       type: typeLabelMap[editedPost.type],
//       period:
//         editedPost.type === "day"
//           ? editedPost.date?.toLocaleDateString("ko-KR") || ""
//           : editedPost.type === "long" && editedPost.date && editedPost.date
//           ? `${editedPost.date.toLocaleDateString(
//               "ko-KR"
//             )} ~ ${editedPost.date.toLocaleDateString("ko-KR")}`
//           : "",
//       times:
//         editedPost.type === "day" && editedPost.startTime && editedPost.endTime
//           ? [
//               `${editedPost.startTime.toLocaleTimeString("ko-KR", {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })} ~ ${editedPost.endTime.toLocaleTimeString("ko-KR", {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}`,
//             ]
//           : editedPost.type === "long" && editedPost.times
//           ? editedPost.startTime
//           : [],
//       place: editedPost.location || "",
//       reward: `${editedPost.reward.toLocaleString()}원`,
//       category: editedPost.title || "",
//     };

//     // 채팅방으로 이동하면서 매칭 데이터 전달
//     navigate(`/chat/${chatId}`, { state: { matchData } });
//   };

//   return (
//     <Layout>
//       <Header title="매칭 확인서" onBack={() => navigate(-1)} showBack />
//       {/* === 공통 필드 === */}
//       <GeneralInput value={typeLabelMap[editedPost.type]} disabled />

//       <GeneralInput
//         inputLabel="제목"
//         value={editedPost.title}
//         disabled
//         required
//       />
//       <HelpTagDropDown
//         selectedTags={selectedTags}
//         onTagsChange={setSelectedTags}
//       />

//       {/* === 하루도움 필드 === */}
//       {editedPost.type === "day" ? (
//         <DayHelpForm editedPost={editedPost} updateField={updateField} />
//       ) : (
//         <LongHelpForm editedPost={editedPost} updateField={updateField} />
//       )}

//       <GeneralInput
//         inputLabel="1회 제공 꿀"
//         value={editedPost.reward.toString()}
//         required
//       />

//       <LocationInput
//         inputLabel="만남 장소"
//         value={editedPost.location || ""}
//         required
//       />

//       <BaseLongButton label="확인" onClick={handleConfirm} />
//     </Layout>
//   );
// };

// export default MatchFormPage;
