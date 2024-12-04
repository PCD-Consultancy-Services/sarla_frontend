import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import URL from "../../../routes/URLs";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  addService,
  getServiceById,
  updateService,
} from "../../../redux/Slices/Master/ServiceSlice";
import PageLayout from "../../../layout/PageLayout";
import ServiceForm from "../../../components/Forms/ServiceForm";

const Service = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { service, loading } = useSelector((state) => state.service);

  useEffect(() => {
    const headerConfig = isEditing
      ? headerURL.editService
      : headerURL.addService;
    dispatch(textState({ text: headerConfig.text, path: headerConfig.path }));

    if (isEditing) {
      dispatch(getServiceById(id));
    }
  }, [id, dispatch]);

  const handleUpdateService = async (data) => {
    try {
      const response = await dispatch(
        updateService({ id, payload: data })
      ).unwrap();
      Swal.fire({
        title: "Success!",
        text: response.message || "Service update successful.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewAllService);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Unexpected error, failed to update service",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  const handleAddService = async (serviceData) => {
    try {
      const response = await dispatch(addService(serviceData)).unwrap();
      Swal.fire({
        title: "Success!",
        text: response.message || "Service creation successful.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewAllService);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Unexpected error, failed to create service",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <PageLayout>
      <ServiceForm
        onSubmit={isEditing ? handleUpdateService : handleAddService}
        initialData={isEditing ? service : null}
        loading={loading}
        onCancel={() => navigate(URL.viewAllService)}
      />
    </PageLayout>
  );
};

export default Service;
