'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>문제가 발생했습니다</h2>
      <p>잠시 후 다시 시도해주세요.</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
