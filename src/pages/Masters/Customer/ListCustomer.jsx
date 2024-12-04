import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { CircularProgress, Typography } from "@mui/material";

// Components
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import Icons from "../../../common/icons";
import { Customer, Edit, Masters } from "../../../constants";
import {
  deleteCustomer,
  fetchCustomers,
} from "../../../redux/Slices/Master/CustomerSlice";
import Swal from "sweetalert2";
import { DeleteConfirmationToaster } from "../../../utils/toasterUtil";
import { onDeleteCheckPageChange } from "../../../utils/paginationUtil";
import Loader from "../../../components/Loader";
import PaginationControls from "../../../components/PaginationControls";
import GridLayout from "../../../layout/GridLayout";

const ListCustomer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const condition = useSelector((state) => state.theme.checkCondition);
  const sectionClass = condition.isOpen ? "page-padding" : "normal-padding";

  const {
    allCustomers,
    loading,
    error,
    totalPages,
    currentPage,
    totalResults,
    pageSize,
    hasNextPage,
    hasPrevPage,
  } = useSelector((state) => state.customer);

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.viewCustomer.text,
        path: headerURL.viewCustomer.path,
      })
    );

    dispatch(fetchCustomers({ page: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire(DeleteConfirmationToaster);

    if (result.isConfirmed) {
      try {
        const response = await dispatch(deleteCustomer(id)).unwrap();
        let newPage = onDeleteCheckPageChange(currentPage, allCustomers.length);
        dispatch(fetchCustomers({ page: newPage, pageSize }));
        Swal.fire({
          title: "Deleted!",
          text: response.message || "Customer deletion successful.",
          icon: "success",
          allowOutsideClick: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Unexpected error, failed to delete Customer",
          icon: "error",
          allowOutsideClick: false,
        }).then(() => {
          dispatch(fetchCustomers({ page: currentPage, pageSize }));
        });
      }
    }
  };

  const handleEditClick = (id) => {
    navigate(`/${Masters}/${Customer}/${Edit}-${Customer}/${id}`);
  };

  const handlePageChange = (event, value) => {
    dispatch(fetchCustomers({ page: value, pageSize }));
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    dispatch(fetchCustomers({ page: 1, pageSize: newSize }));
  };

  const rows = allCustomers?.map((user, index) => ({
    id: user?._id,
    sr_No: index + 1 + (currentPage - 1) * pageSize,
    customer_name: user?.name,
    customer_code: user?.custCode,
    createdAt: user?.createdAt,
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
      field: "customer_name",
      headerName: "Customer Name",
      minWidth: 120,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "customer_code",
      headerName: "Customer Code",
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
          <Grid item xs={12} style={{ overflowX: "auto" , padding: 0 }}>
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

export default ListCustomer;
