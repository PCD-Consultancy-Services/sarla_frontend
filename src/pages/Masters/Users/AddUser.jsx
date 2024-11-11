import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { fetchRoles } from "../../../redux/Slices/Master/RolesSlice";
import { createUser } from "../../../redux/Slices/Master/UsersSlice";
import URL from "../../../routes/URLs";
import UserForm from "../../../components/Forms/UserForm";
import PageLayout from "../../../layout/PageLayout";

const AddUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

    const { loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.addUser.text,
        path: headerURL.addUser.path,
      })
    );
    dispatch(fetchRoles({ pageSize: 5, page: 1 }));
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...restData } = data;
      const response = await dispatch(createUser(restData)).unwrap();
      Swal.fire({
        title: "Success!",
        text: response.message || "User creation successful",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewUser);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Unexpected error, failed to create user.",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <PageLayout>
      <UserForm
        onSubmit={onSubmit}
        loading={loading}
        onCancel={() => navigate(URL.viewUser)}
      />
    </PageLayout>
  );
};

export default AddUser;
