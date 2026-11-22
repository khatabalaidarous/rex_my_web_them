export default function LocaleLoading() {
  return (
    <div className="container-page animate-pulse py-24">
      <div className="h-4 w-32 rounded-full bg-surface-2" />
      <div className="mt-6 h-14 w-4/5 rounded-2xl bg-surface-2" />
      <div className="mt-4 h-14 w-3/5 rounded-2xl bg-surface-2" />
      <div className="mt-8 h-5 w-2/3 rounded-full bg-surface-2" />
      <div className="mt-10 flex gap-3">
        <div className="h-13 w-40 rounded-full bg-surface-2" />
        <div className="h-13 w-40 rounded-full bg-surface-2" />
      </div>
      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="surface-card h-40" />
        ))}
      </div>
    </div>
  );
}