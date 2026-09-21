const cardClass = 'flex h-full flex-col rounded-[20px] border border-slate-200 bg-white p-3 shadow-sm'

export default function ProductSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`${cardClass} animate-pulse`}>
          <div className="mb-4 h-56 rounded-[18px] bg-slate-200" />
          <div className="mb-3 h-3 w-16 rounded-full bg-slate-200" />
          <div className="mb-2 h-4 w-3/4 rounded-full bg-slate-200" />
          <div className="mb-5 h-3 w-1/2 rounded-full bg-slate-200" />
          <div className="mb-4 h-3 w-1/3 rounded-full bg-slate-200" />
          <div className="mt-auto h-10 rounded-xl bg-slate-200" />
        </div>
      ))}
    </div>
  )
}
