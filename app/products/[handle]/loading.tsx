export default function ProductLoading() {
  return (
    <div className="container-page grid animate-pulse gap-10 pb-24 pt-8 sm:pb-10 md:grid-cols-2 md:gap-14 md:py-14">
      <div className="aspect-square rounded-card bg-sand" />
      <div className="space-y-4">
        <div className="h-8 w-2/3 rounded bg-sand" />
        <div className="h-6 w-1/4 rounded bg-sand" />
        <div className="h-4 w-full rounded bg-sand" />
        <div className="h-4 w-5/6 rounded bg-sand" />
        <div className="h-12 w-full rounded-pill bg-sand" />
      </div>
    </div>
  );
}
