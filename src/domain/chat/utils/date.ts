export const formatChatTime = (utcString: string) => {
  const date = new Date(utcString);
  const now = new Date();

  // 오늘 00:00
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  // 어제 00:00
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfToday.getDate() - 1);

  if (date >= startOfToday) {
    // 오늘 → 시간만
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (date >= startOfYesterday) {
    // 어제
    return "어제";
  }

  // 그 이전 → 날짜만
  return date.toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
  });
};
