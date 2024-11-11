import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Swal from "sweetalert2";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import dayjs from "dayjs";

// Components
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import Icons from "../../../common/icons";
import { Masters, Edit, Chemical } from "../../../constants";
import {
  fetchChemicals,
  deleteChemical,
} from "../../../redux/Slices/Master/ChemicalSlice";
import { CircularProgress, Pagination, Typography } from "@mui/material";
import { DeleteConfirmationToaster } from "../../../utils/toasterUtil";
import { onDeleteCheckPageChange } from "../../../utils/paginationUtil";

const ViewChemical = () => {
  const condition = useSelector((state) => state.theme.checkCondition);
  const sectionClass = condition.isOpen ? "page-padding" : "normal-padding";
  const {
    allChemicals,
    loading,
    error,
    totalPages,
    currentPage,
    totalResults,
    pageSize,
    hasNextPage,
    hasPrevPage,
  } = useSelector((state) => state.chemical);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.viewChemical.text,
        path: headerURL.viewChemical.path,
      })
    );

    dispatch(fetchChemicals({ page: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire(DeleteConfirmationToaster);

    if (result.isConfirmed) {
      try {
        const response = await dispatch(deleteChemical(id)).unwrap();
        let newPage = onDeleteCheckPageChange(currentPage, allChemicals.length);
        dispatch(fetchChemicals({ page: newPage, pageSize }));
        Swal.fire({
          title: "Deleted!",
          text: response.message || "Chemical deletion successful.",
          icon: "success",
          allowOutsideClick: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Unexpected error, failed to delete chemical",
          icon: "error",
          allowOutsideClick: false,
        }).then(() => {
          dispatch(fetchChemicals({ page: currentPage, pageSize }));
        });
      }
    }
  };

  const handleEditClick = (id) => {
    navigate(`/${Masters}/${Chemical}/${Edit}-${Chemical}/${id}`);
  };

  const handlePageChange = (event, value) => {
    dispatch(fetchChemicals({ page: value, pageSize }));
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    dispatch(fetchChemicals({ page: 1, pageSize: newSize }));
  };

  const rows = allChemicals?.map((data, index) => ({
    id: data._id,
    sr_No: index + 1 + (currentPage - 1) * pageSize,
    chemical_name: data.name || "N/A",
    material_code: data.materialCode || "N/A",
    classification_name: data.classifId?.name || "N/A",
    tank_name: data.tankId?.name || "N/A",
    fluid_state: data.fluidState || "N/A",
    min_consumption: data.minConsumption || "N/A",
    max_consumption: data.maxConsumption || "N/A",
    consumption_unit: data.consumptionUnit || "N/A",
    ph: data.ph || "N/A",
    ph_unit: data.phUnit || "N/A",
    density: data.density || "N/A",
    density_unit: data.densityUnit || "N/A",
    conductivity: data.conductivity || "N/A",
    conductivity_unit: data.conductivityUnit || "N/A",
    viscosity: data.viscosity || "N/A",
    viscosity_unit: data.viscosityUnit || "N/A",
    createdAt: data.createdAt,
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
      field: "chemical_name",
      headerName: "Chemical Name",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "material_code",
      headerName: "Material Code",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "classification_name",
      headerName: "Classification",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "tank_name",
      headerName: "Tank Name",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "fluid_state",
      headerName: "Fluid State",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "min_consumption",
      headerName: "Min Consumption",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "max_consumption",
      headerName: "Max Consumption",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "consumption_unit",
      headerName: "Consumption Unit",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "ph_unit",
      headerName: "pH Unit",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "density",
      headerName: "Density",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "density_unit",
      headerName: "Density Unit",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "conductivity",
      headerName: "Conductivity",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "conductivity_unit",
      headerName: "Conductivity Unit",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "viscosity",
      headerName: "Viscosity",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "viscosity_unit",
      headerName: "Viscosity Unit",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => {
        const createdAt = dayjs(params.value).format("YYYY-MM-DD");
        return createdAt;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      minWidth: 180,
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
        <Grid
          className="page-list-table"
          container
          direction="center"
          spacing={2}
          bgcolor={"white"}
          borderRadius={"15px"}
          padding={"15px"}
        >
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography>Error: {error.message}</Typography>
          ) : rows.length === 0 ? (
            <p>No Data Available</p>
          ) : (
            <Grid
              container
              direction="center"
              spacing={2}
              bgcolor={"white"}
              borderRadius={"15px"}
              padding={"15px"}
            >
              <Grid item xs={12} style={{ overflowX: "auto" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  autoHeight
                  getRowId={(row) => row.id}
                />
              </Grid>
            </Grid>
          )}
          <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, totalResults)} of{" "}
                {totalResults} entries
              </Typography>
              <Box display="flex" alignItems="center">
                <label htmlFor="pageSize" className="px-2">
                  Page Size
                </label>
                <div className="d-flex  align-items-center me-3">
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
          </Grid>
        </Grid>
      </Box>
    </section>
  );
};

export default ViewChemical;
