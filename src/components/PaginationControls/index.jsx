import React from "react";
import { Box, Typography, Pagination } from "@mui/material";

const PaginationControls = ({
  currentPage,
  totalPages,
  totalResults,
  pageSize,
  handlePageChange,
  handlePageSizeChange,
  hasNextPage,
  hasPrevPage,
}) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography>
        Showing {(currentPage - 1) * pageSize + 1} to{" "}
        {Math.min(currentPage * pageSize, totalResults)} of {totalResults} entries
      </Typography>
      <Box display="flex" alignItems="center">
        <label htmlFor="pageSize" className="px-2">
          Page Size
        </label>
        <div className="d-flex align-items-center me-3">
          <select
            id="pageSize"
            className="form-select"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          showFirstButton={hasPrevPage}
          showLastButton={hasNextPage}
        />
      </Box>
    </Box>
  );
};

export default PaginationControls;
