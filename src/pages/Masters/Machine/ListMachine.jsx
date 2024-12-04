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
import { Edit, Machine, Masters } from "../../../constants";
import Swal from "sweetalert2";
import {
  deleteMachine,
  fetchMachine,
} from "../../../redux/Slices/Master/MachineSlice";
import { Typography } from "@mui/material";
import { onDeleteCheckPageChange } from "../../../utils/paginationUtil";
import { DeleteConfirmationToaster } from "../../../utils/toasterUtil";
import PaginationControls from "../../../components/PaginationControls";
import GridLayout from "../../../layout/GridLayout";
import Loader from "../../../components/Loader"

const ListMachine = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const condition = useSelector((state) => state.theme.checkCondition);
  const sectionClass = condition.isOpen ? "page-padding" : "normal-padding";

  const {
    allMachine,
    loading,
    error,
    totalPages,
    currentPage,
    totalResults,
    pageSize,
    hasNextPage,
    hasPrevPage,
  } = useSelector((state) => state.machine);

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.viewMachine.text,
        path: headerURL.viewMachine.path,
      })
    );

    dispatch(fetchMachine({ page: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire(DeleteConfirmationToaster);

    if (result.isConfirmed) {
      try {
        const response = await dispatch(deleteMachine(id)).unwrap();
        let newPage = onDeleteCheckPageChange(currentPage, allMachine.length);
        dispatch(fetchMachine({ page: newPage, pageSize }));
        Swal.fire("Deleted!", response.message, "success");
      } catch (error) {
        Swal.fire("Error!", "There was a problem deleting the user.", "error");
      }
    }
  };

  const handleEditClick = (id) => {
    navigate(`/${Masters}/${Machine}/${Edit}-${Machine}/${id}`);
  };
  const handlePageChange = (event, value) => {
    dispatch(fetchMachine({ page: value, pageSize }));
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    dispatch(fetchMachine({ page: 1, pageSize: newSize }));
  };

  const rows = allMachine?.map((machine, index) => ({
    id: machine?._id,
    sr_No: index + 1 + (currentPage - 1) * pageSize,
    machine_name: machine?.name,
    service_name: machine?.serviceId?.name,
    literage: machine?.literage,
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
      field: "service_name",
      headerName: "Service Name",
      minWidth: 120,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "literage",
      headerName: "Literage",
      minWidth: 120,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
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
          <Grid item xs={12} style={{ overflowX: "auto"  , padding : 0}}>
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

export default ListMachine;
