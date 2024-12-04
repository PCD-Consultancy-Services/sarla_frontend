import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { useNavigate, useParams } from "react-router-dom";
import { fetchService } from "../../../redux/Slices/Master/ServiceSlice";
import { fetchQualityUnits } from "../../../redux/Slices/Master/QualityUnits";
import {
    createQuality,
  getQualityById,
  updateQuality,
} from "../../../redux/Slices/Master/QualitySlice";
import Swal from "sweetalert2";
import URL from "../../../routes/URLs";
import PageLayout from "../../../layout/PageLayout";
import QualityForm from "../../../components/Forms/QualityForm";

const Quality = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { loading, quality } = useSelector((state) => state.quality);

  useEffect(() => {
    const headerConfig = isEditing
      ? headerURL.editQuality
      : headerURL.addQuality;
    dispatch(textState({ text: headerConfig.text, path: headerConfig.path }));

    dispatch(fetchService({ pageSize: 5, page: 1 }));
    dispatch(fetchQualityUnits());

    if (isEditing) {
      dispatch(getQualityById(id));
    }
  }, [id, dispatch]);

  const handleUpdateQuality = async (data) => {
    try {
      const payload = {
        id,
        data,
      };
      const originalPromiseResult = await dispatch(
        updateQuality(payload)
      ).unwrap();
      console.log("================================================");
      console.log("onSubmit response ==>", originalPromiseResult);
      console.log("================================================");
      Swal.fire({
        title: "Success!",
        text: originalPromiseResult?.message || "Quality update successful.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewQuality);
      });
    } catch (rejectedValueOrSerializedError) {
      console.log("================================================");
      console.log("onSubmit ERROR", rejectedValueOrSerializedError);
      console.log("================================================");
      Swal.fire({
        title: "Error!",
        text:
          rejectedValueOrSerializedError.message || "Quality update failed.",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  const handleAddQuality = async (data) => {
    try {
      const originalPromiseResult = await dispatch(
        createQuality(data)
      ).unwrap();
      console.log("================================================");
      console.log("onSubmit response ==>", originalPromiseResult);
      console.log("================================================");
      Swal.fire({
        title: "Success!",
        text: originalPromiseResult?.message || "Quality creation successful.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewQuality);
      });
    } catch (rejectedValueOrSerializedError) {
      console.log("================================================");
      console.log("onSubmit ERROR", rejectedValueOrSerializedError);
      console.log("================================================");
      Swal.fire({
        title: "Error!",
        text:
          rejectedValueOrSerializedError.message || "Quality creation failed.",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <PageLayout className={`h-auto pb-5`}>
      <QualityForm
        onSubmit={isEditing ? handleUpdateQuality : handleAddQuality}
        initialData={isEditing ?  quality : null}
        isEdit={isEditing ? true : false}
        loading={loading}
        onCancel={() => navigate(-1)}
      />
    </PageLayout>
  );
};

export default Quality;
