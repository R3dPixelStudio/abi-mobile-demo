export default function Loading() {
  return (
    <div
      className="container loading"
      aria-label="در حال بارگذاری"
      role="status"
    >
      <span className="skeleton" />
      <span className="skeleton" />
      <span className="skeleton" />
    </div>
  );
}
