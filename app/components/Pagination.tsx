"use client";

import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalResults = 0,
  startIndex = 0,
  endIndex = 0,
  onPageChange,
}) => {
  const displayTotalPages = Math.max(1, totalPages);
  let startPage = Math.max(1, currentPage - 1);
  if (startPage + 2 > displayTotalPages) {
    startPage = Math.max(1, displayTotalPages - 2);
  }

  const pagesAroundCurrent = Array.from(
    { length: Math.min(4, displayTotalPages) },
    (_, i) => startPage + i,
  );

  return (
    <div className="flex items-center justify-between p-3 flex-col md:flex-row gap-8">
      <span className="text-gray-800 text-sm">
        Showing {startIndex} to {endIndex} of {totalResults} results
      </span>

      <div className="flex items-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous"
          aria-label="Previous Page"
          className="shadow-theme-xs mr-2.5 flex aspect-square h-10 items-center justify-center rounded-lg border border-gray-600 disabled:border-gray-300 bg-white text-sm hover:bg-gray-300 cursor-pointer disabled:opacity-50 disabled:text-gray-400"
        >
          <ChevronLeftOutlinedIcon />
        </button>
        <div className="flex items-center gap-2">
          {currentPage > 4 && <span className="px-2 text-[#65736f]">...</span>}
          {pagesAroundCurrent.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`rounded px-4 py-2 ${
                currentPage === page
                  ? "bg-[#176d64] text-white"
                  : "text-gray-700"
              } hover:text-white flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium hover:bg-teal-950`}
            >
              {page}
            </button>
          ))}
          {currentPage < totalPages - 3 && (
            <span className="px-2 text-[#65736f]">...</span>
          )}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          title="Next"
          aria-label="Next Page"
          className="shadow-theme-xs ml-2.5 flex aspect-square h-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm hover:bg-gray-300 cursor-pointer disabled:opacity-50 disabled:text-gray-400"
        >
          <ChevronRightOutlinedIcon color="inherit" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
