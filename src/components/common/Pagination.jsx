import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div
      className="
        flex
        items-center
        justify-center
        gap-2
        sm:gap-4
        mt-6
        flex-wrap
      "
    >
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="
          flex
          items-center
          justify-center
          h-10
          w-10
          border
          rounded-lg
          bg-white
          hover:bg-gray-100
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        <ChevronLeft size={18} />
      </button>

      <span
        className="
          text-sm
          sm:text-base
          font-medium
          whitespace-nowrap
        "
      >
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="
          flex
          items-center
          justify-center
          h-10
          w-10
          border
          rounded-lg
          bg-white
          hover:bg-gray-100
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
