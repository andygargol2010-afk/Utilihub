/** First paint for the lazy home catalog. Same grids as HomeCatalogRest so reviews and the footer do not jump when the chunk arrives. */
export function HomeCatalogSlot() {
  return (
    <div aria-hidden>
      <section className="pt-10 pb-10 sm:pt-12 sm:pb-12">
        <div className="h-4 w-28 rounded bg-muted" />
        <div className="mt-2 h-8 w-64 max-w-full rounded bg-muted" />
        <div className="mt-2 h-4 w-80 max-w-full rounded bg-muted" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="min-h-[7.25rem] rounded-xl border border-border/70 bg-card" />
          ))}
        </div>
      </section>
      <section className="mt-10 border-t border-border/70 py-10">
        <div className="h-4 w-36 rounded bg-muted" />
        <div className="mt-2 h-8 w-48 max-w-full rounded bg-muted" />
        <div className="mt-2 h-4 w-72 max-w-full rounded bg-muted" />
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 17 }, (_, index) => (
            <div key={index} className="min-h-16 rounded-xl border border-border/70 bg-card" />
          ))}
        </div>
      </section>
    </div>
  );
}
