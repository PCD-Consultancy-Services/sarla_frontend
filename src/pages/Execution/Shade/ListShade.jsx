import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

// Components
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import Icons from "../../../common/icons";
import { Edit, Execution, Shade } from "../../../constants";
import {
  deleteShade,
  fetchShade,
} from "../../../redux/Slices/Execution/ShadeSlice";
import { DeleteConfirmationToaster } from "../../../utils/toasterUtil";
import { onDeleteCheckPageChange } from "../../../utils/paginationUtil";
import Swal from "sweetalert2";
import { CircularProgress, Typography } from "@mui/material";
import GridLayout from "../../../layout/GridLayout";
import Loader from "../../../components/Loader";
import PaginationControls from "../../../components/PaginationControls";

const ListShade = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const condition = useSelector((state) => state.theme.checkCondition);
  const sectionClass = condition.isOpen ? "page-padding" : "normal-padding";
  const {
    allShade,
    loading,
    error,
    totalPages,
    currentPage,
    totalResults,
    pageSize,
    hasNextPage,
    hasPrevPage,
  } = useSelector((state) => state.shade);

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.viewShade.text,
        path: headerURL.viewShade.path,
      })
    );
    dispatch(fetchShade({ page: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire(DeleteConfirmationToaster);

    if (result.isConfirmed) {
      try {
        const response = await dispatch(deleteShade(id)).unwrap();
        let newPage = onDeleteCheckPageChange(currentPage, allShade.length);
        dispatch(fetchShade({ page: newPage, pageSize }));
        Swal.fire({
          title: "Deleted!",
          text: response.message || "Service deletion successful.",
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
          dispatch(fetchShade({ page: currentPage, pageSize }));
        });
      }
    }
  };

  const handleEditClick = (id) => {
    navigate(`/${Execution}/${Shade}/${Edit}-${Shade}/${id}`);
  };
  const handlePageChange = (event, value) => {
    dispatch(fetchShade({ page: value, pageSize }));
  };
  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    dispatch(fetchShade({ page: 1, pageSize: newSize }));
  };
  const rows = allShade?.map((shade, index) => ({
    id: shade?._id,
    sr_No: index + 1 + (currentPage - 1) * pageSize,
    shade_no: shade?.shadeCode,
    shade_color: shade?.color,
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
      headerName: "Shade No.",
      minWidth: 120,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "shade_color",
      headerName: "Shade Color",
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
          <Grid item xs={12} style={{ overflowX: "auto", padding : 0 }}>
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

export default ListShade;
