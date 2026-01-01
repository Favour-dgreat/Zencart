"use client";

type Props = {
  message?: string;
  retry?: () => void;
};

export default function Error({
  message = "Something went wrong",
  retry,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <p className="text-red-600 text-lg font-semibold">{message}</p>

      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}
