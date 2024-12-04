import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import Icons from "../../../common/icons";
import { Edit, Masters, User } from "../../../constants";
import {
  deleteUser,
  fetchUsers,
} from "../../../redux/Slices/Master/UsersSlice";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { DeleteConfirmationToaster } from "../../../utils/toasterUtil";
import { onDeleteCheckPageChange } from "../../../utils/paginationUtil";
import Loader from "../../../components/Loader";
import PaginationControls from "../../../components/PaginationControls";
import GridLayout from "../../../layout/GridLayout";

const ListUsers = () => {
  const condition = useSelector((state) => state.theme.checkCondition);
  const sectionClass = condition.isOpen ? "page-padding" : "normal-padding";
  const {
    allusers,
    loading,
    error,
    totalPages,
    currentPage,
    totalResults,
    pageSize,
    hasNextPage,
    hasPrevPage,
  } = useSelector((state) => state.users);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.viewUser.text,
        path: headerURL.viewUser.path,
      })
    );

    dispatch(fetchUsers({ page: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire(DeleteConfirmationToaster);

    if (result.isConfirmed) {
      try {
        const response = await dispatch(deleteUser(id)).unwrap();

        let newPage = onDeleteCheckPageChange(currentPage, allusers.length);

        dispatch(fetchUsers({ page: newPage, pageSize }));
        Swal.fire({
          title: "Deleted!",
          text: response.message || "User deletion successful.",
          icon: "success",
          allowOutsideClick: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Unexpected error, failed to delete user",
          icon: "error",
          allowOutsideClick: false,
        }).then(() => {
          dispatch(fetchUsers({ page: currentPage, pageSize }));
        });
      }
    }
  };

  const handleEditClick = (id) => {
    console.log(id);
    navigate(`/${Masters}/${User}/${Edit}-${User}/${id}`);
  };

  const handlePageChange = (event, value) => {
    dispatch(fetchUsers({ page: value, pageSize }));
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    dispatch(fetchUsers({ page: 1, pageSize: newSize }));
  };

  const rows = allusers?.map((user, index) => ({
    id: user?._id,
    sr_No: index + 1 + (currentPage - 1) * pageSize,
    name: user?.name,
    role: user?.role.name,
    mobileNum: user?.mobileNum,
    email: user?.email,
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
      field: "name",
      headerName: "Name",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "mobileNum",
      headerName: "Mobile Number",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "email",
      headerName: "Email",
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
        const createdAt = dayjs(params);
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
        <GridLayout
        >
          <Grid item xs={12} style={{ overflowX: "auto" , padding : 0 }}>
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

export default ListUsers;
