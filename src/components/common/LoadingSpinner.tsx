// components/LoadingSpinner.tsx

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
