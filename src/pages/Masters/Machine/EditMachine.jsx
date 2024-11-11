import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { useNavigate, useParams } from "react-router-dom";
import URL from "../../../routes/URLs";
import {
  getMachineById,
  updateMachine,
} from "../../../redux/Slices/Master/MachineSlice";
import Swal from "sweetalert2";
import PageLayout from "../../../layout/PageLayout";
import MachineForm from "../../../components/Forms/MachineForm";

const EditMachine = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, machine } = useSelector((state) => state.machine);

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.editMachine.text,
        path: headerURL.editMachine.path,
      })
    );
    dispatch(getMachineById(id));
  }, [id, dispatch]);

  const onSubmit = async (machineData) => {
    try {
      const payload = {
        id,
        payload: {
          ...machineData,
          serviceId: machineData.serviceId,
        },
      };
      const response = await dispatch(updateMachine(payload)).unwrap();
      Swal.fire({
        title: "Success!",
        text: response.message || "Customer update successful.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewMachine);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Unexpected error, failed to update machine",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <PageLayout>
      <MachineForm
        onSubmit={onSubmit}
        loading={loading}
        initialData={machine}
        onCancel={() => navigate(URL.viewMachine)}
      />
    </PageLayout>
  );
};

export default EditMachine;
