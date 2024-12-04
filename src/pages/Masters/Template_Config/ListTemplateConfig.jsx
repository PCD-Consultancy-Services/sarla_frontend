import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

// Components
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import Icons from "../../../common/icons";
import { Edit, Masters, TemplateConfig } from "../../../constants";
import { CircularProgress, Typography } from "@mui/material";
import Swal from "sweetalert2";
import Loader from "../../../components/Loader"
import {
  deleteMasterTemplate,
  fetchMasterTemplate,
} from "../../../redux/Slices/Master/MasterTemplateSlice";
import { DeleteConfirmationToaster } from "../../../utils/toasterUtil";
import { onDeleteCheckPageChange } from "../../../utils/paginationUtil";
import GridLayout from "../../../layout/GridLayout";
import PaginationControls from "../../../components/PaginationControls";

const ListTemplateConfig = () => {
  const condition = useSelector((state) => state.theme.checkCondition);
  const sectionClass = condition.isOpen ? "page-padding" : "normal-padding";

  const {
    allMasterTemplate,
    loading,
    error,
    totalPages,
    currentPage,
    totalResults,
    pageSize,
    hasNextPage,
    hasPrevPage,
  } = useSelector((state) => state.masterTemplate);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.viewTemplate.text,
        path: headerURL.viewTemplate.path,
      })
    );

    dispatch(fetchMasterTemplate({ page: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire(DeleteConfirmationToaster);

    if (result.isConfirmed) {
      try {
        const response = await dispatch(deleteMasterTemplate(id)).unwrap();

        let newPage = onDeleteCheckPageChange(
          currentPage,
          allMasterTemplate.length
        );
        dispatch(fetchMasterTemplate({ page: newPage, pageSize }));
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
          dispatch(fetchMasterTemplate({ page: currentPage, pageSize }));
        });
      }
    }
  };

  const handleEditClick = (id) => {
    navigate(`/${Masters}/${TemplateConfig}/${Edit}-${TemplateConfig}/${id}`);
  };

  const handlePageChange = (event, value) => {
    dispatch(fetchMasterTemplate({ page: value, pageSize }));
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    dispatch(fetchMasterTemplate({ page: 1, pageSize: newSize }));
  };

  const rows = allMasterTemplate.map((data, index) => ({
    id: data?._id,
    sr_No: index + 1 + (currentPage - 1) * pageSize,
    shade_no: data?.name,
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
      headerName: "Template Name",
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
      headerAlign: "center",
      align: "center",
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
        <GridLayout>
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

export default ListTemplateConfig;
