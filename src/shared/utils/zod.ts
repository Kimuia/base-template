import type { ZodError } from 'zod';

/**
 * ZodError에서 필드별 에러 메시지를 추출
 *
 * Zod v4에서 .flatten()이 deprecated 되었으므로
 * issues 배열에서 직접 필드 에러를 추출한다.
 */
export function extractFieldErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path[0]?.toString();
    if (field) {
      fieldErrors[field] ??= [];
      fieldErrors[field].push(issue.message);
    }
  }

  return fieldErrors;
}
