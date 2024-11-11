import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import {
  getChemicalById,
  updateChemical,
} from "../../../redux/Slices/Master/ChemicalSlice";
import Swal from "sweetalert2";
import URL from "../../../routes/URLs";
import PageLayout from "../../../layout/PageLayout";
import ChemicalForm from "../../../components/Forms/ChemicalForm";

const EditChemical = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { chemical, loading } = useSelector((state) => state.chemical);

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.editChemical.text,
        path: headerURL.editChemical.path,
      })
    );

    dispatch(getChemicalById(id));
  }, [dispatch, id]);

  const onSubmit = async (data) => {
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

  return (
    <PageLayout className={`h-auto pb-5`}>
      <ChemicalForm
        onSubmit={onSubmit}
        initialData={chemical}
        loading={loading}
        onCancel={() => navigate(URL.viewAllChemical)}
      />
    </PageLayout>
  );
};

export default EditChemical;
