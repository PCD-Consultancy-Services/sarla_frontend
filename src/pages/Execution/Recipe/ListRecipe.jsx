import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Swal from "sweetalert2";
// Components
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import Icons from "../../../common/icons";
import { Duplicate, Edit, Execution, Recipe } from "../../../constants";
import {
  fetchAllReceipe,
  deleteRecipe,
} from "../../../redux/Slices/Execution/RecipeSlice"; 
import {  Typography } from "@mui/material";
import { DeleteConfirmationToaster } from "../../../utils/toasterUtil";
import { onDeleteCheckPageChange } from "../../../utils/paginationUtil";
import GridLayout from "../../../layout/GridLayout";
import Loader from "../../../components/Loader";
import PaginationControls from "../../../components/PaginationControls";

const ListRecipe = () => {
  const condition = useSelector((state) => state.theme.checkCondition);
  const sectionClass = condition.isOpen ? "page-padding" : "normal-padding";
  const {
    allRecipes,
    loading,
    error,
    totalPages,
    currentPage,
    totalResults,
    pageSize,
    hasNextPage,
    hasPrevPage,
  } = useSelector((state) => state.recipe);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.viewRecipe.text,
        path: headerURL.viewRecipe.path,
      })
    );

    dispatch(fetchAllReceipe({ page: currentPage, pageSize }));
  }, [dispatch]);

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire(DeleteConfirmationToaster);

    if (result.isConfirmed) {
      try {
        const response = await dispatch(deleteRecipe(id)).unwrap();
        let newPage = onDeleteCheckPageChange(currentPage, allRecipes.length);
        dispatch(fetchAllReceipe({ page: newPage, pageSize }));
        Swal.fire({
          title: "Deleted!",
          text: response.message || "Recipe deletion successful.",
          icon: "success",
          allowOutsideClick: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Unexpected error, failed to delete Recipe",
          icon: "error",
          allowOutsideClick: false,
        });
      }
    }
  };

  const handleEditClick = (id) => {
    navigate(`/${Execution}/${Recipe}/${Edit}-${Recipe}/${id}`);
  };

  const handleDuplicateClick = (id) => {
    navigate(`/${Execution}/${Recipe}/${Duplicate}-${Recipe}/${id}`);
  };

  const handlePageChange = (event, value) => {
    dispatch(fetchAllReceipe({ page: value, pageSize }));
  };
  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    dispatch(fetchAllReceipe({ page: 1, pageSize: newSize }));
  };

  const rows = allRecipes?.map((data, index) => ({
    id: data._id,
    sr_no: index + 1 + (currentPage - 1) * pageSize,
    shadeCode: data?.shadeId?.shadeCode,
    shadeColor: data?.shadeId?.color,
    quality: data?.qualityId?.qualityCode,
    customer: `${data?.customerId?.name} - ${data?.customerId?.custCode}`,
    ...data,
  }));

  const columns = [
    {
      field: "sr_no",
      headerName: "Sr. No.",
      minWidth: 120,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "shadeCode",
      headerName: "Shade Code.",
      minWidth: 120,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "shadeColor",
      headerName: "Shade Color",
      minWidth: 120,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "quality",
      headerName: "Quality Name",
      minWidth: 120,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "customer",
      headerName: "Customer",
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
          icon={Icons.editIcon}
          label="Edit"
          onClick={() => handleEditClick(id)}
        />,
        <GridActionsCellItem
        icon={Icons.copyIcon}
        label="Edit"
        onClick={() => handleDuplicateClick(id)}
      />,
        <GridActionsCellItem
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
              <Typography>Error: {error?.message}</Typography>
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

export default ListRecipe;
