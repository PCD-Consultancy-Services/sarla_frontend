import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageLayout from "../../../layout/PageLayout";
import { useNavigate } from "react-router-dom";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { createChemical } from "../../../redux/Slices/Master/ChemicalSlice";
import Swal from "sweetalert2";
import URL from "../../../routes/URLs";
import ChemicalForm from "../../../components/Forms/ChemicalForm";

function AddChemical() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.chemical);

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.addChemical.text,
        path: headerURL.addChemical.path,
      })
    );
  }, [dispatch]);

  const onSubmit = async (chemicalData) => {
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
        onSubmit={onSubmit}
        onCancel={() => navigate(URL.viewAllChemical)}
        loading={loading}
      />
    </PageLayout>
  );
}

export default AddChemical;
