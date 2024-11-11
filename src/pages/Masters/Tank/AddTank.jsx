import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import URL from "../../../routes/URLs";
import headerURL from "../../headerURL";
import { createTank } from "../../../redux/Slices/Master/TankSlice";
import TankForm from "../../../components/Forms/TankForm";
import PageLayout from "../../../layout/PageLayout";

function AddTank() {
  const { loading } = useSelector((state) => state.tanks);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.addTank.text,
        path: headerURL.addTank.path,
      })
    );
  }, [dispatch]);

  const onSubmit = async (data) => {
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
        onSubmit={onSubmit}
        loading={loading}
        onCancel={() => navigate(URL.viewAllTank)}
      />
    </PageLayout>
  );
}

export default AddTank;
