import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import Icons from "../../../common/icons";
import { Edit, Masters, Tank } from "../../../constants";
import { deleteTank, fetchTanks } from "../../../redux/Slices/Master/TankSlice";
import { CircularProgress, Typography } from "@mui/material";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { DeleteConfirmationToaster } from "../../../utils/toasterUtil";
import { onDeleteCheckPageChange } from "../../../utils/paginationUtil";
import PaginationControls from "../../../components/PaginationControls";
import GridLayout from "../../../layout/GridLayout";
import Loader from "../../../components/Loader";

const ListTank = () => {
  const condition = useSelector((state) => state.theme.checkCondition);
  const sectionClass = condition.isOpen ? "page-padding" : "normal-padding";
  const {
    allTanks,
    loading,
    error,
    totalPages,
    currentPage,
    totalResults,
    pageSize,
    hasNextPage,
    hasPrevPage,
  } = useSelector((state) => state.tanks);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.viewTank.text,
        path: headerURL.viewTank.path,
      })
    );
    dispatch(fetchTanks({ page: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire(DeleteConfirmationToaster);

    if (result.isConfirmed) {
      try {
        const response = await dispatch(deleteTank(id)).unwrap();
        let newPage = onDeleteCheckPageChange(currentPage, allTanks.length);

        dispatch(fetchTanks({ page: newPage, pageSize })); // Refresh data
        Swal.fire({
          title: "Deleted!",
          text: response.message || "Tank deletion successful.",
          icon: "success",
          allowOutsideClick: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Unexpected error, failed to delete tank",
          icon: "error",
          allowOutsideClick: false,
        }).then(() => {
          dispatch(fetchTanks({ page: currentPage, pageSize }));
        });
      }
    }
  };

  const handleEditClick = (id) => {
    navigate(`/${Masters}/${Tank}/${Edit}-${Tank}/${id}`);
  };

  const handlePageChange = (event, value) => {
    dispatch(fetchTanks({ page: value, pageSize }));
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    dispatch(fetchTanks({ page: 1, pageSize: newSize }));
  };

  const rows = allTanks?.map((tank, index) => ({
    id: tank._id,
    sr_No: index + 1 + (currentPage - 1) * pageSize,
    name: tank.name,
    solenoid_S: tank.solenoid_S,
    solenoid_L: tank.solenoid_L,
    createdAt: tank.createdAt,
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
      field: "name",
      headerName: "Name",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "solenoid_S",
      headerName: "solenoid_S",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "solenoid_L",
      headerName: "solenoid_L",
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
        const createdAt = dayjs(params.value);
        return createdAt.format("DD/MM/YYYY");
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
        <GridLayout>
          <Grid  item xs={12} style={{ overflowX: "auto" , padding : 0 }}>
            {loading ? (
              <Loader />
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

export default ListTank;
