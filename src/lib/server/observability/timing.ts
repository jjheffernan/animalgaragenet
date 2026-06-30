export async function withRequestTiming<T>(
	fn: () => Promise<T>
): Promise<{ result: T; durationMs: number }> {
	const started = performance.now();
	const result = await fn();
	return { result, durationMs: Math.round(performance.now() - started) };
}
