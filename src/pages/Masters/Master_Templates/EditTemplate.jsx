import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import URL from "../../../routes/URLs";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getMasterTemplateById,
  updateMasterTemplate,
} from "../../../redux/Slices/Master/MasterTemplateSlice";
import PageLayout from "../../../layout/PageLayout";
import MasterTemplateForm from "../../../components/Forms/MasterTemplateForm";

const EditTemplate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const { masterTemplate, loading } = useSelector(
    (state) => state.masterTemplate
  );

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.editTemplate.text,
        path: headerURL.editTemplate.path,
      })
    );

    dispatch(getMasterTemplateById(id));
  }, [id, dispatch]);

  const onSubmit = async (data) => {
    console.log(data, "-------------------");

    try {
      const payload = {
        name: data.name,
      };
      const response = await dispatch(
        updateMasterTemplate({ id, payload })
      ).unwrap();
      Swal.fire({
        title: "Success!",
        text: response.message || "Template update successful.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewTemplate);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Unexpected error, failed to update template.",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <PageLayout>
      <MasterTemplateForm
        onSubmit={onSubmit}
        initialData={ masterTemplate}
        loading={loading}
        onCancel={() => navigate(URL.viewTemplateConfig)}
      />
    </PageLayout>
  );
};

export default EditTemplate;
