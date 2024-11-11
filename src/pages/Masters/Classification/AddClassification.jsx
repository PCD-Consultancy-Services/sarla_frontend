import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import URL from "../../../routes/URLs";
import { useNavigate } from "react-router-dom";
import { addClassification } from "../../../redux/Slices/Master/ClassificationSlice";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import PageLayout from "../../../layout/PageLayout";
import ClassifictionForm from "../../../components/Forms/ClassificationForm";

const AddClassification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.classification);

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.addClassification.text,
        path: headerURL.addClassification.path,
      })
    );
  }, [dispatch]);

  const onSubmit = async (classificationData) => {
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
        onSubmit={onSubmit}
        loading={loading}
        onCancel={() => navigate(URL.viewAllClassification)}
      />
    </PageLayout>
  );
};

export default AddClassification;
