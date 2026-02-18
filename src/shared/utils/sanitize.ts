/**
 * HTML 태그를 제거하여 순수 텍스트 반환
 */
export function stripHtml(dirty: string): string {
  return dirty.replace(/<[^>]*>/g, '');
}

/**
 * URL-safe 문자열 생성 (slug)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
