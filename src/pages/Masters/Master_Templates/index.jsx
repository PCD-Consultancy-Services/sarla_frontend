import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import URL from "../../../routes/URLs";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  addMasterTemplate,
  getMasterTemplateById,
  updateMasterTemplate,
} from "../../../redux/Slices/Master/MasterTemplateSlice";
import PageLayout from "../../../layout/PageLayout";
import MasterTemplateForm from "../../../components/Forms/MasterTemplateForm";

const MasterTemplate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { masterTemplate, loading } = useSelector(
    (state) => state.masterTemplate
  );

  useEffect(() => {
    const headerConfig = isEditing
      ? headerURL.editTemplate
      : headerURL.addTemplate;
    dispatch(textState({ text: headerConfig.text, path: headerConfig.path }));

    if (isEditing) {
        dispatch(getMasterTemplateById(id));
    }
  }, [id, dispatch]);

  const handleUpdateMasterTemp = async (data) => {
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

  const handleAddMasterTemp = async (masterTemplateData) => {
    try {
      const response = await dispatch(
        addMasterTemplate(masterTemplateData)
      ).unwrap();
      Swal.fire({
        title: "Success!",
        icon: "success",
        text: response.message || "Template creation successful.",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewTemplate);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Unexpected error, failed to create Template.",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <PageLayout>
      <MasterTemplateForm
        onSubmit={isEditing ? handleUpdateMasterTemp : handleAddMasterTemp}
        initialData={isEditing ? masterTemplate : null}
        loading={loading}
        onCancel={() => navigate(URL.viewTemplate)}
      />
    </PageLayout>
  );
};

export default MasterTemplate;
