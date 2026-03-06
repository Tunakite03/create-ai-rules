const PERFORMANCE_BY_VERBOSITY = {
   minimal: `## Performance
- Correctness first; optimize only when needed.
- Avoid obvious N+1 and unbounded memory usage.
`,
   standard: `## Performance
- Correctness first; avoid premature optimization.
- Avoid N+1 calls and unbounded list responses.
- Use pagination/streaming for large payloads.
- Measure before introducing caching/memoization.
- Bound concurrency and set timeouts/cancellation for I/O-heavy code.
`,
   strict: `## Performance
- Prioritize correctness, then optimize using profiling evidence.
- Eliminate N+1 patterns and bound expensive operations.
- Use pagination, batching, and streaming where data size can grow.
- Bound concurrency, add timeouts/deadlines at I/O boundaries, and make retries idempotent where applicable.
- Avoid unnecessary allocations and repeated expensive work in hot paths.
`,
};

export function performanceRules(verbosity = 'standard') {
   return PERFORMANCE_BY_VERBOSITY[verbosity] ?? PERFORMANCE_BY_VERBOSITY.standard;
}
