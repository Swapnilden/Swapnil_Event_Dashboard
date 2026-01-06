interface LoadingSkeletonProps {
  count?: number
}

export function LoadingSkeleton({ count = 1 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 bg-slate-100 rounded-lg animate-pulse"
        >
          <div className="h-5 bg-slate-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-slate-300 rounded w-1/2"></div>
        </div>
      ))}
    </>
  )
}