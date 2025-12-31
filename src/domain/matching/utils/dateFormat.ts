// 해당 데이터 포맷은 게시글 및 매칭현황 등 여러곳에서 사용 가능

export const formatDateWithDay = (dateString: string) => {
  const date = new Date(dateString);

  const month = date.getMonth() + 1;
  const day = date.getDate();

  const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

  return `${month}/${day}(${dayOfWeek})`;
};
