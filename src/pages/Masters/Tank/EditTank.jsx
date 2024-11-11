import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import URL from "../../../routes/URLs";
import headerURL from "../../headerURL";
import {
  getTankById,
  updateTank,
} from "../../../redux/Slices/Master/TankSlice";
import TankForm from "../../../components/Forms/TankForm";
import PageLayout from "../../../layout/PageLayout";

const EditTank = () => {
  const { tank, loading } = useSelector((state) => state.tanks);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.editTank.text,
        path: headerURL.editTank.path,
      })
    );
    dispatch(getTankById(id));
  }, [dispatch, id]);

  const onSubmit = async (data) => {
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

  return (
    <PageLayout>
      <TankForm
        onSubmit={onSubmit}
        initialData={tank}
        loading={loading}
        onCancel={() => navigate(URL.viewAllTank)}
      />
    </PageLayout>
  );
};

export default EditTank;
