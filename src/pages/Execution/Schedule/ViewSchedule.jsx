import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Swal from "sweetalert2";

// Components
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import Icons from "../../../common/icons";
import { Edit, Execution, Schedule } from "../../../constants";
import {
  deleteSchedule,
  fetchSchedule,
} from "../../../redux/Slices/Execution/scheduleSlice";
import { DeleteConfirmationToaster } from "../../../utils/toasterUtil";
import { onDeleteCheckPageChange } from "../../../utils/paginationUtil";
import { CircularProgress, Typography } from "@mui/material";

const ViewSchedule = () => {
  const condition = useSelector((state) => state.theme.checkCondition);
  const sectionClass = condition.isOpen ? "page-padding" : "normal-padding";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    allschedule,
    loading,
    error,
    totalPages,
    currentPage,
    totalResults,
    pageSize,
    hasNextPage,
    hasPrevPage,
  } = useSelector((state) => state.schedule);
  console.log(totalPages, "totalPages");
  console.log(currentPage, "currentPage");
  console.log(totalResults, "totalResults");

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.viewSchedule.text,
        path: headerURL.viewSchedule.path,
      })
    );
    dispatch(fetchSchedule({ page: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire(DeleteConfirmationToaster);

    if (result.isConfirmed) {
      try {
        const response = await dispatch(deleteSchedule(id)).unwrap();
        let newPage = onDeleteCheckPageChange(currentPage, allschedule.length);
        dispatch(fetchSchedule({ page: newPage, pageSize }));
        Swal.fire({
          title: "Deleted!",
          text: response.message || "Schedule deletion successful.",
          icon: "success",
          allowOutsideClick: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Unexpected error, failed to delete Schedule",
          icon: "error",
          allowOutsideClick: false,
        }).then(() => {
          dispatch(fetchSchedule({ page: currentPage, pageSize }));
        });
      }
    }
  };

  const handleEditClick = (id) => {
    navigate(`/${Execution}/${Schedule}/${Edit}-${Schedule}/${id}`);
  };

  const handlePageChange = (event, value) => {
    dispatch(fetchSchedule({ page: value, pageSize }));
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    dispatch(fetchSchedule({ page: 1, pageSize: newSize }));
  };

  const rows = allschedule?.map((schedule, index) => ({
    id: schedule?._id,
    sr_No: index + 1 + (currentPage - 1) * pageSize,
    machine_name: schedule?.machineId?.name,
    card_batch: schedule?.cardBatche,
    shade_no: schedule?.shadeId?.shadeCode,
    quality_name: schedule?.qualityId?.qualityCode,
    type: schedule?.recipeType,
    customer_name: schedule?.customerId?.name,
    slip_no: schedule?.slipNumber,
    batch_weight: schedule?.batchWeight,
    cones: schedule?.cones,
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
      field: "machine_name",
      headerName: "Machine Name",
      minWidth: 120,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "card_batch",
      headerName: "Card Batch",
      minWidth: 120,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "shade_no",
      headerName: "Shade Number",
      minWidth: 120,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "quality_name",
      headerName: "Quality Name",
      minWidth: 120,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "type",
      headerName: "Type",
      minWidth: 120,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "customer_name",
      headerName: "Customer Name",
      minWidth: 120,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "slip_no",
      headerName: "Slip Number",
      minWidth: 120,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "batch_weight",
      headerName: "Batch Weight",
      minWidth: 120,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "cones",
      headerName: "Cones",
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
          icon={Icons.editIcon}
          label="Edit"
          onClick={() => handleEditClick(id)}
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
        <Grid
          className="page-list-table"
          container
          direction="center"
          spacing={2}
          bgcolor={"white"}
          borderRadius={"15px"}
          padding={"15px"}
        >
          <Grid item xs={12} style={{ overflowX: "auto" }}>
            {loading ? (
              <Typography>
                <CircularProgress />
              </Typography>
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

export default ViewSchedule;
