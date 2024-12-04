import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { fetchRoles } from "../../../redux/Slices/Master/RolesSlice";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import URL from "../../../routes/URLs";
import {
    createUser,
  getUserById,
  updateUser,
} from "../../../redux/Slices/Master/UsersSlice";
import PageLayout from "../../../layout/PageLayout";
import UserForm from "../../../components/Forms/UserForm";

const Users = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();   
  const isEditing = Boolean(id);
  const { user, loading } = useSelector((state) => state.users);

  useEffect(() => {
    const headerConfig = isEditing ? headerURL.editUser : headerURL.addUser
    dispatch(textState({ text: headerConfig.text, path: headerConfig.path }));

    if (isEditing) {
        dispatch(getUserById(id));
    }

    dispatch(fetchRoles());
  }, [id, dispatch]);

  const updateUserSubmit = async (data) => {
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

  const addUserSubmit = async (data) => {
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
        onSubmit={isEditing ? updateUserSubmit : addUserSubmit}
        loading={loading}
        initialData={isEditing ? user : null}
        onCancel={() => navigate(URL.viewUser)}
        isEdit={isEditing ? true : false}
      />
    </PageLayout>
  );
};

export default Users;
