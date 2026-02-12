export default function PageLoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col items-center gap-4">
        <div
          style={{ borderColor: "#e7e5e4", borderTopColor: "#b2bfa2" }}
          className="rounded-full w-10 h-10 border-4 animate-spin"
        />
        <span className="font-medium text-stone-500 animate-pulse">
          {message || "Loading..."}
        </span>
      </div>
    </div>
  );
}
