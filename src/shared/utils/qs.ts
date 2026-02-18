/**
 * 객체를 URLSearchParams 문자열로 변환
 */
export function toQueryString(
  params: Record<string, string | number | boolean | undefined>,
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const result = searchParams.toString();
  return result ? `?${result}` : '';
}

/**
 * URLSearchParams를 객체로 변환
 */
export function fromQueryString(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  return Object.fromEntries(params.entries());
}
