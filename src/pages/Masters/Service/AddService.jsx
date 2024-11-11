import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import URL from "../../../routes/URLs";
import { useNavigate } from "react-router-dom";
import { addService } from "../../../redux/Slices/Master/ServiceSlice";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import PageLayout from "../../../layout/PageLayout";
import ServiceForm from "../../../components/Forms/ServiceForm";

const AddService = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.service);

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.addService.text,
        path: headerURL.addService.path,
      })
    );
  }, [dispatch]);

  const onSubmit = async (serviceData) => {
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
       onSubmit={onSubmit}
       loading={loading}
       onCancel={() => navigate(URL.viewAllService)}
    />
    </PageLayout>
  );
};

export default AddService;
