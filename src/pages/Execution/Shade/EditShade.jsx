import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import {
  getShadeById,
  updateShade,
  searchShade,
} from "../../../redux/Slices/Execution/ShadeSlice";
import URL from "../../../routes/URLs";
import headerURL from "../../headerURL";
import PageLayout from "../../../layout/PageLayout";
import ShadeForm from "../../../components/Forms/ShadeForm";

function EditShade() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { shade, loading } = useSelector((state) => state.shade);

  useEffect(() => {
    dispatch(textState({
      text: headerURL.editShade.text,
      path: headerURL.editShade.path,
    }));
    dispatch(getShadeById(id));
  }, [id, dispatch]);

  const onSubmit = async (shadeData) => {
    try {
      const response = await dispatch(updateShade({ id, data: shadeData })).unwrap();
      Swal.fire({
        title: "Success!",
        text: response.message || "Shade update successful.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewAllShades);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Unexpected error, failed to update shade",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  return (
      <PageLayout>
        <ShadeForm
          onSubmit={onSubmit}
          initialData={shade}
          loading={loading}
          onCancel={() => navigate(URL.viewAllShades)}
        />
      </PageLayout>
  );
}

export default EditShade;
