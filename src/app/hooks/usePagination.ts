import { DEFAULT_PAGE_SIZE } from "@/constants";
import { useState } from "react";

export function usePagination<DataType>(data: DataType[]) {
  const [currentPage, setCurrentPage] = useState(0);

  return {
    currentPage,
    setCurrentPage,
    totalPages: Math.floor(data.length / DEFAULT_PAGE_SIZE),
    currentData: data.slice(
      currentPage * DEFAULT_PAGE_SIZE,
      currentPage * DEFAULT_PAGE_SIZE + DEFAULT_PAGE_SIZE
    ),
  };
}
