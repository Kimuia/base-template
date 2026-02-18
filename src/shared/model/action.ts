import type { ErrorCode } from './error';

export type ActionResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      data: null;
      error: ErrorCode;
      fieldErrors?: Record<string, string[]>;
    };

// useActionState initialState 용 (아직 action이 실행되지 않은 상태)
export type FormState<T> = ActionResult<T> | { success: null; data: null };

export const IDLE_FORM_STATE: FormState<never> = {
  success: null,
  data: null,
};
