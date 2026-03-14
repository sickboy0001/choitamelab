export const formatDateToJst = (
  dateStr: string | undefined | null,
  format: string = "yyyy-MM-dd HH:mm:ss", // デフォルトの形式
): string => {
  if (!dateStr) return "-";

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    console.error("Invalid Date input:", dateStr);
    return dateStr;
  }

  // 1. 00:00:00 かどうかの判定
  const isZeroTime = /00:00:00/.test(dateStr);

  // 2. 補正ロジック
  // JSが勝手に引いた9時間を戻す(getTimezoneOffsetはJST環境なら-540を返すので、その絶対値を足す)
  if (!isZeroTime) {
    // 00:00:00 以外はJSTにすることで、自然と９時間つかされるので時差の追加はこれ以上不要
    date.setMinutes(date.getMinutes() + Math.abs(date.getTimezoneOffset()));
  } else {
    // 00:00:00 の時は JSが引いた分だけを戻して、日付を維持する
    date.setMinutes(date.getMinutes() + Math.abs(date.getTimezoneOffset()));
  }

  // 3. 各パーツの取得
  const pad = (n: number) => String(n).padStart(2, "0");
  const parts: Record<string, string> = {
    yyyy: String(date.getFullYear()),
    MM: pad(date.getMonth() + 1),
    dd: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  };

  // 4. フォーマット文字列に基づいて置換
  // yyyy -> 2026, MM -> 03 ... と順番に書き換えます
  let result = format;
  (Object.keys(parts) as (keyof typeof parts)[]).forEach((key) => {
    result = result.replace(key, parts[key]);
  });

  return result;
};
