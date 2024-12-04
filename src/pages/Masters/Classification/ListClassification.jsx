import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { fetchClassification } from "../../../redux/Slices/Master/ClassificationSlice";
import { CircularProgress, Typography } from "@mui/material";
import Swal from "sweetalert2";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import Icons from "../../../common/icons";
import { Classification, Edit, Masters } from "../../../constants";
import { deleteClassification } from "../../../redux/Slices/Master/ClassificationSlice";
import { DeleteConfirmationToaster } from "../../../utils/toasterUtil";
import { onDeleteCheckPageChange } from "../../../utils/paginationUtil";
import GridLayout from "../../../layout/GridLayout";
import PaginationControls from "../../../components/PaginationControls";
import Loader from "../../../components/Loader";

const ListClassification = () => {
  const condition = useSelector((state) => state.theme.checkCondition);
  const sectionClass = condition.isOpen ? "page-padding" : "normal-padding";
  const {
    allClassification,
    loading,
    error,
    totalPages,
    currentPage,
    totalResults,
    pageSize,
    hasNextPage,
    hasPrevPage,
  } = useSelector((state) => state.classification);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.viewClassification.text,
        path: headerURL.viewClassification.path,
      })
    );
    dispatch(fetchClassification({ page: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire(DeleteConfirmationToaster);

    if (result.isConfirmed) {
      try {
        const response = await dispatch(deleteClassification(id)).unwrap();

        let newPage = onDeleteCheckPageChange(
          currentPage,
          allClassification.length
        );
        dispatch(fetchClassification({ page: newPage, pageSize }));
        Swal.fire({
          title: "Deleted!",
          text: response.message || "Classification deletion successful.",
          icon: "success",
          allowOutsideClick: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Unexpected error, failed to delete service",
          icon: "error",
          allowOutsideClick: false,
        }).then(() => {
          dispatch(fetchClassification({ page: currentPage, pageSize }));
        });
      }
    }
  };

  const handleEditClick = (id) => {
    navigate(`/${Masters}/${Classification}/${Edit}-${Classification}/${id}`);
  };

  const handlePageChange = (event, value) => {
    dispatch(fetchClassification({ page: value, pageSize }));
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    dispatch(fetchClassification({ page: 1, pageSize: newSize }));
  };

  const rows =
    allClassification &&
    allClassification.map((data, index) => ({
      id: data?._id,
      sr_No: index + 1 + (currentPage - 1) * pageSize,
      shade_no: data?.name,
      createdAt: data?.createdAt,
    }));

  const columns = [
    {
      field: "sr_No",
      headerName: "Sr. No.",
      minWidth: 120,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "shade_no",
      headerName: "Classification Name",
      minWidth: 120,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      minWidth: 120,
      flex: 1,
      headerClassName: "table-header-text",
      headerAlign: "center",
      align: "center",
      cellClassName: "actions",
      getActions: ({ id }) => [
        <GridActionsCellItem
          key={id}
          icon={Icons.editIcon}
          label="Edit"
          onClick={() => handleEditClick(id)}
        />,
        <GridActionsCellItem
          key={id}
          icon={Icons.deleteIcon}
          label="Delete"
          onClick={() => handleDeleteClick(id)}
        />,
      ],
    },
  ];

  return (
    <section className={`sky-bg listActionSection ${sectionClass}`}>
      <Box paddingTop={5}>
        <GridLayout
        >
          <Grid item xs={12} style={{ overflowX: "auto" , padding : 0 }}>
            {loading ? (
              <Loader/>
            ) : error ? (
              <Typography>Error: {error.message}</Typography>
            ) : (
              <DataGrid
                getRowId={(row) => row.id}
                editMode="row"
                rows={rows}
                columns={columns}
              />
            )}
          </Grid>
          {!loading && (
            <Grid item xs={12}>
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalResults}
                pageSize={pageSize}
                handlePageChange={handlePageChange}
                handlePageSizeChange={handlePageSizeChange}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
              />
            </Grid>
          )}
        </GridLayout>
      </Box>
    </section>
  );
};

export default ListClassification;
