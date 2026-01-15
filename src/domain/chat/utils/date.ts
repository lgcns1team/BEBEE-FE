export const formatChatTime = (utcString: string) => {
  const makeKstDate = (str: string) => {
    if (!str) return new Date(str);
    const hasTz = /[zZ]|[+-]\d\d:\d\d$/.test(str);
    return new Date(hasTz ? str : `${str}Z`);
  };

  const date = makeKstDate(utcString);
  const now = makeKstDate(new Date().toISOString());

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
      timeZone: "Asia/Seoul",
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
    timeZone: "Asia/Seoul",
  });
};
