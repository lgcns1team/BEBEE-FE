import axios from "axios";

export const uploadImageToS3 = async (file: File) => {
  // 1. Presigned URL 요청
  const { data } = await axios.post("/files/presigned-url", {
    directory: "posts",
    entityId: Date.now().toString(), // 게시글 생성 전이라면 임시 ID(타임스탬프 등) 부여
    originFileName: file.name,
    contentType: file.type,
  });

  const { uploadUrl, fileUrl } = data;

  // 2. S3로 직접 업로드 (PUT 요청)
  // 주의: 이때 headers의 Content-Type은 위에서 요청한 값과 정확히 일치해야 함
  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
  });

  return fileUrl; // 최종적으로 서버(posts/)에 보낼 URL 반환
};
