export default function CollectionLoading() {
  return (
    <div className="container-page animate-pulse py-10">
      <div className="h-8 w-1/3 rounded bg-sand" />
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-square rounded-card bg-sand" />
            <div className="mt-3 h-4 w-2/3 rounded bg-sand" />
            <div className="mt-2 h-4 w-1/3 rounded bg-sand" />
          </div>
        ))}
      </div>
    </div>
  );
}
