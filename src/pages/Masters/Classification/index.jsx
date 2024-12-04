import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import URL from "../../../routes/URLs";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { useNavigate, useParams } from "react-router-dom";
import {
    addClassification,
  getClassificationById,
  updateClassification,
} from "../../../redux/Slices/Master/ClassificationSlice";
import Swal from "sweetalert2";
import ClassifictionForm from "../../../components/Forms/ClassificationForm";
import PageLayout from "../../../layout/PageLayout";

const Classification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { classification, loading } = useSelector(
    (state) => state.classification
  );

  useEffect(() => {
    const headerConfig = isEditing
      ? headerURL.editClassification
      : headerURL.addClassification;
    dispatch(textState({ text: headerConfig.text, path: headerConfig.path }));

    if (isEditing) {
      dispatch(getClassificationById(id));
    }
  }, [id, dispatch]);

  const handleUpdateClassification = async (data) => {
    try {
      const payload = {
        name: data.name,
      };
      const response = await dispatch(
        updateClassification({ id, payload })
      ).unwrap();
      console.log(response);
      Swal.fire({
        title: "Success!",
        text: response?.message || "classification updated successfully.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewAllClassification);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text:
          error.message || "Unexpected error, failed to update classification.",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  const handleAddClassification = async (classificationData) => {
    try {
      const response = await dispatch(
        addClassification(classificationData)
      ).unwrap();
      Swal.fire({
        title: "Success!",
        text: response.message || "classification created successfully.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewAllClassification);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text:
          error?.message ||
          "Unexpected error, failed to create classification.",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <PageLayout>
      <ClassifictionForm
        onSubmit={isEditing ? handleUpdateClassification : handleAddClassification}
        initialData={isEditing ? classification : null}
        loading={loading}
        onCancel={() => navigate(URL.viewAllClassification)}
      />
    </PageLayout>
  );
};

export default Classification;
