import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";

import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { fetchRoles } from "../../../redux/Slices/Master/RolesSlice";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import URL from "../../../routes/URLs";
import {
  getUserById,
  updateUser,
} from "../../../redux/Slices/Master/UsersSlice";
import PageLayout from "../../../layout/PageLayout";
import UserForm from "../../../components/Forms/UserForm";

const EditUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { user, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.editUser.text,
        path: headerURL.editUser.path,
      })
    );
    dispatch(fetchRoles());
    dispatch(getUserById(id));
  }, [id, dispatch]);

  const onSubmit = async (data) => {
    try {
      const { mobileNum, role } = data;
      const payload = {
        mobileNum,
        role,
      };
      const response = await dispatch(updateUser({ id, payload })).unwrap();
      Swal.fire({
        title: "Success!",
        text: response?.message || "User updated successfully.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewUser);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Unexpected error, failed to update user",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <PageLayout>
      <UserForm
        onSubmit={onSubmit}
        initialData={user}
        loading={loading}
        onCancel={() => navigate(URL.viewUser)}
        isEdit={true}
      />
    </PageLayout>
  );
};

export default EditUser;
