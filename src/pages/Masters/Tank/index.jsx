import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import URL from "../../../routes/URLs";
import headerURL from "../../headerURL";
import {
    createTank,
  getTankById,
  updateTank,
} from "../../../redux/Slices/Master/TankSlice";
import TankForm from "../../../components/Forms/TankForm";
import PageLayout from "../../../layout/PageLayout";

const Tank = () => {
  const { tank, loading } = useSelector((state) => state.tanks);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditing = Boolean(id);

  useEffect(() => {
    const headerConfig = isEditing ? headerURL.editTank : headerURL.addTank;
    dispatch(textState({ text: headerConfig.text, path: headerConfig.path }));

    if (isEditing) {
      dispatch(getTankById(id));
    }
  }, [dispatch, id]);

  const handleUpdateTank = async (data) => {
    try {
      const response = await dispatch(updateTank({ id, data })).unwrap();
      Swal.fire({
        title: "Success!",
        text: response.message || "Tank update successful.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewAllTank);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Unexpected error, failed to update tank",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  const handleAddTank = async (data) => {
    try {
      if (data.solenoid_S === "") {
        delete data.solenoid_S;
      }
      if (data.solenoid_L === "") {
        delete data.solenoid_L;
      }
      const response = await dispatch(createTank(data)).unwrap();
      Swal.fire({
        title: "Success!",
        text: response.message || "Tank creation successful.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewAllTank);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Unexpected error, failed to create tank.",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <PageLayout>
      <TankForm
        onSubmit={isEditing ? handleUpdateTank : handleAddTank}
        initialData={isEditing ? tank : null}
        loading={loading}
        onCancel={() => navigate(URL.viewAllTank)}
      />
    </PageLayout>
  );
};

export default Tank;
