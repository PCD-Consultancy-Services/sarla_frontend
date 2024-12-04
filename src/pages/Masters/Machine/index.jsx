import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import {
  addMachine,
  getMachineById,
  updateMachine,
} from "../../../redux/Slices/Master/MachineSlice";
import { fetchService } from "../../../redux/Slices/Master/ServiceSlice";
import headerURL from "../../headerURL";
import URL from "../../../routes/URLs";
import PageLayout from "../../../layout/PageLayout";
import MachineForm from "../../../components/Forms/MachineForm";
import Swal from "sweetalert2";

const Machine = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { loading, machine } = useSelector((state) => state.machine);

  useEffect(() => {
    const headerConfig = isEditing
      ? headerURL.editMachine
      : headerURL.addMachine;
    dispatch(textState({ text: headerConfig.text, path: headerConfig.path }));

    if (isEditing) {
      dispatch(getMachineById(id));
    } 
  }, [id, isEditing, dispatch]);

  const handleAddMachine = async (machineData) => {
    try {
      const response = await dispatch(addMachine(machineData)).unwrap();
      Swal.fire({
        title: "Success!",
        text: response.message || "Machine created successfully.",
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

  const handleUpdateMachine = async (machineData) => {
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
        onSubmit={isEditing ? handleUpdateMachine : handleAddMachine}
        loading={loading}
        initialData={isEditing ? machine : null}
        onCancel={() => navigate(URL.viewMachine)}
      />
    </PageLayout>
  );
};

export default Machine;
