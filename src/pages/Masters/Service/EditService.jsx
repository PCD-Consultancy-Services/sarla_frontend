import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import URL from "../../../routes/URLs";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getServiceById,
  updateService,
} from "../../../redux/Slices/Master/ServiceSlice";
import PageLayout from "../../../layout/PageLayout";
import ServiceForm from "../../../components/Forms/ServiceForm";

const EditService = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { service, loading } = useSelector((state) => state.service);
  console.log(service.name);
  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.editService.text,
        path: headerURL.editService.path,
      })
    );
    dispatch(getServiceById(id));
  }, [id, dispatch]);

  const onSubmit = async (data) => {
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

  return (
    <PageLayout>
      <ServiceForm
        onSubmit={onSubmit}
        initialData={service}
        loading={loading}
        onCancel={() => navigate(URL.viewAllService)}
      />
    </PageLayout>
  );
};

export default EditService;
