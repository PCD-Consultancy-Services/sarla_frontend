import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

// Components
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import Icons from "../../../common/icons";
import { Edit, Masters, Quality } from "../../../constants";
import {
  deleteQuality,
  fetchQualities,
} from "../../../redux/Slices/Master/QualitySlice";
import { CircularProgress, Pagination, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { DeleteConfirmationToaster } from "../../../utils/toasterUtil";
import { onDeleteCheckPageChange } from "../../../utils/paginationUtil";

const ViewQuality = () => {
  const condition = useSelector((state) => state.theme.checkCondition);
  const sectionClass = condition.isOpen ? "page-padding" : "normal-padding";
  const {
    allQualities,
    loading,
    error,
    totalPages,
    currentPage,
    totalResults,
    pageSize,
    hasNextPage,
    hasPrevPage,
  } = useSelector((state) => state.quality);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.viewQuality.text,
        path: headerURL.viewQuality.path,
      })
    );

    dispatch(fetchQualities({ page: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire(DeleteConfirmationToaster);

    if (result.isConfirmed) {
      try {
        const response = dispatch(deleteQuality(id)).unwrap();
        let newPage = onDeleteCheckPageChange(currentPage, allQualities.length);
        dispatch(fetchQualities({ page: newPage, pageSize })); // Refresh data
        Swal.fire("Deleted!", response.message, "success");
      } catch (error) {
        Swal.fire("Error!", "There was a problem deleting the user.", "error");
      }
    }
  };

  const handleEditClick = (id) => {
    navigate(`/${Masters}/${Quality}/${Edit}-${Quality}/${id}`);
  };

  const handlePageChange = (event, value) => {
    dispatch(fetchQualities({ page: value, pageSize }));
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    dispatch(fetchQualities({ page: 1, pageSize: newSize }));
  };

  const rows = allQualities?.map((data, index) => ({
    id: data?._id,
    sr_No: index + 1 + (currentPage - 1) * pageSize,
    quality_name: data?.qualityCodeManual,
    quality_code: data?.qualityCode,
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
      field: "quality_name",
      headerName: "Quality Name",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "quality_code",
      headerName: "Quality Code",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
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
          sx={{
            bgcolor: "white",
            borderRadius: "15px",
            padding: "15px",
          }}
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
        </Grid>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalResults)} of {totalResults}{" "}
              entries
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
      </Box>
    </section>
  );
};

export default ViewQuality;
