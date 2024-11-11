import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { useNavigate } from "react-router-dom";
import URL from "../../../routes/URLs";
import { addMachine } from "../../../redux/Slices/Master/MachineSlice";
import Swal from "sweetalert2";
import { fetchService } from "../../../redux/Slices/Master/ServiceSlice";
import PageLayout from "../../../layout/PageLayout";
import MachineForm from "../../../components/Forms/MachineForm";

const AddMachine = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.machine);
  const { allServices } = useSelector((state) => state.service);
  console.log(allServices, "all-------------");

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.addMachine.text,
        path: headerURL.addMachine.path,
      })
    );
    dispatch(fetchService({ pageSize: 5, page: 1 }));
  }, [dispatch]);

  const onSubmit = async (machineData) => {
    try {
      const response = await dispatch(addMachine(machineData)).unwrap();
      Swal.fire({
        title: "Success!",
        text: response.message || "Machine creation successful.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewMachine);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Unexpected error, failed to create machine",
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
        onCancel={() => navigate(URL.viewMachine)}
        allServices={allServices}
      />
    </PageLayout>
  );
};

export default AddMachine;
