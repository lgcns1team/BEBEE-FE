const DAY_LABEL = ["일", "월", "화", "수", "목", "금", "토"] as const;

/** YYYY-MM-DD → "11월 31일 (화)" */
export const formatDayDate = (date: string) => {
  const d = new Date(date);

  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayLabel = DAY_LABEL[d.getDay()];

  return `${month}월 ${day}일 (${dayLabel})`;
};
