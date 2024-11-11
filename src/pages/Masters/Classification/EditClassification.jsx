import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import URL from "../../../routes/URLs";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { useNavigate, useParams } from "react-router-dom";
import {
  getClassificationById,
  updateClassification,
} from "../../../redux/Slices/Master/ClassificationSlice";
import Swal from "sweetalert2";
import ClassifictionForm from "../../../components/Forms/ClassificationForm";
import PageLayout from "../../../layout/PageLayout";

const EditClassification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  // const { roles } = useSelector((state) => state.roles);
  const { classification, loading } = useSelector(
    (state) => state.classification
  );

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.editClassification.text,
        path: headerURL.editClassification.path,
      })
    );

    dispatch(getClassificationById(id));
  }, [id, dispatch]);

  const onSubmit = async (data) => {
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

  return (
    <PageLayout>
      <ClassifictionForm
        onSubmit={onSubmit}
        initialData={classification}
        loading={loading}
        onCancel={() => navigate(URL.viewAllClassification)}
      />
    </PageLayout>
  );
};

export default EditClassification;
