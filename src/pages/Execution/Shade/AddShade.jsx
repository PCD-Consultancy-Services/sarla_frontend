import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PageLayout from "../../../layout/PageLayout";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import {
  createShade,
  searchShade,
} from "../../../redux/Slices/Execution/ShadeSlice";
import ShadeForm from "../../../components/Forms/ShadeForm"; 
import URL from "../../../routes/URLs";

const AddShade = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { shadeOptions, colorOptions , loading } = useSelector((state) => state.shade);

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.addShade.text,
        path: headerURL.addShade.path,
      })
    );
  }, [dispatch]);

  const onSubmit = async (shadeData) => {
    console.log(shadeData , "shadeData")
    try {
      const response = await dispatch(createShade(shadeData)).unwrap();
      Swal.fire({
        title: "Success!",
        text: response.message || "Shade creation successful.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewAllShades);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Unexpected error, failed to create shade",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <PageLayout>
      <ShadeForm
        onSubmit={onSubmit}
        loading={loading}
        shadeOptions={shadeOptions}
        colorOptions={colorOptions}
        onCancel={() => navigate(URL.viewAllShades)}
      />
    </PageLayout>
  );
};

export default AddShade;
