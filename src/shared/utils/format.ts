/**
 * 날짜를 'YYYY.MM.DD' 형식으로 포맷
 * @param date - Date 객체 또는 ISO 문자열
 * @returns 'YYYY.MM.DD' 형식의 문자열
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

/**
 * 날짜와 시간을 'YYYY.MM.DD HH:mm' 형식으로 포맷
 * @param date - Date 객체 또는 ISO 문자열
 * @returns 'YYYY.MM.DD HH:mm' 형식의 문자열
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const datePart = formatDate(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${datePart} ${hours}:${minutes}`;
}

/**
 * 숫자를 천 단위 구분자로 포맷
 * @param num - 포맷할 숫자
 * @returns 천 단위 콤마가 적용된 문자열
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR');
}

/**
 * 금액을 원화 형식으로 포맷
 * @param amount - 금액 (숫자)
 * @returns '1,000원' 형식의 문자열
 */
export function formatCurrency(amount: number): string {
  return `${formatNumber(amount)}원`;
}

/**
 * 목록의 역순 항목 번호 계산 (페이지네이션용)
 * @param totalCount - 전체 항목 수
 * @param currentPage - 현재 페이지 번호 (1부터 시작)
 * @param itemsPerPage - 페이지당 항목 수
 * @param index - 현재 페이지 내 항목 인덱스 (0부터 시작)
 * @returns 역순 번호 (가장 최근 항목이 가장 큰 번호)
 */
export function calculateItemNumber(
  totalCount: number,
  currentPage: number,
  itemsPerPage: number,
  index: number,
): number {
  return totalCount - ((currentPage - 1) * itemsPerPage + index);
}
