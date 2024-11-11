export const onDeleteCheckPageChange = (currentPage, listingDataLength) => {
  // handle if last entry delete then move first page
  let newPage = currentPage;
  // Check if the current page should be adjusted
  if (listingDataLength === 1 && currentPage > 1) {
    newPage = currentPage - 1;
  }
  return newPage;
};
