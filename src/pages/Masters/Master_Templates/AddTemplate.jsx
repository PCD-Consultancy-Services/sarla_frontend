import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import URL from "../../../routes/URLs";
import { useNavigate } from "react-router-dom";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { addMasterTemplate } from "../../../redux/Slices/Master/MasterTemplateSlice";
import PageLayout from "../../../layout/PageLayout";
import MasterTemplateForm from "../../../components/Forms/MasterTemplateForm";

const AddTemplate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.masterTemplate);

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.addTemplate.text,
        path: headerURL.addTemplate.path,
      })
    );
  }, [dispatch]);

  const onSubmit = async (masterTemplateData) => {
    console.log("working");
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
        onSubmit={onSubmit}
        loading={loading}
        onCancel={() => navigate(URL.viewTemplateConfig)}
      />
    </PageLayout>
  );
};

export default AddTemplate;
