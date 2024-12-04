import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import {
  createChemical,
  getChemicalById,
  updateChemical,
} from "../../../redux/Slices/Master/ChemicalSlice";
import Swal from "sweetalert2";
import URL from "../../../routes/URLs";
import PageLayout from "../../../layout/PageLayout";
import ChemicalForm from "../../../components/Forms/ChemicalForm";

const Chemical = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { chemical, loading } = useSelector((state) => state.chemical);

  useEffect(() => {
    const headerConfig = isEditing
      ? headerURL.editChemical
      : headerURL.addChemical;
    dispatch(textState({ text: headerConfig.text, path: headerConfig.path }));

    if (isEditing) {
      dispatch(getChemicalById(id));
    }
  }, [dispatch, id]);

  const handleUpdateChemical = async (data) => {
    try {
      const response = await dispatch(updateChemical({ id, data })).unwrap();
      Swal.fire({
        title: "Success!",
        text: response.message || "Chemical update successful.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewAllChemical);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Unexpected error, failed to update chemical",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  const handleAddChemical = async (chemicalData) => {
    try {
      const response = await dispatch(createChemical(chemicalData)).unwrap();
      Swal.fire({
        title: "Success!",
        text: response.message || "Chemical creation successful.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewAllChemical);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Unexpected error, failed to create chemical",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <PageLayout className={`h-auto pb-5`}>
      <ChemicalForm
        onSubmit={isEditing ? handleUpdateChemical : handleAddChemical}
        initialData={isEditing ? chemical : null}
        loading={loading}
        onCancel={() => navigate(URL.viewAllChemical)}
      />
    </PageLayout>
  );
};

export default Chemical;
