import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { useNavigate, useParams } from "react-router-dom";
import { fetchService } from "../../../redux/Slices/Master/ServiceSlice";
import { fetchQualityUnits } from "../../../redux/Slices/Master/QualityUnits";
import {
  getQualityById,
  updateQuality,
} from "../../../redux/Slices/Master/QualitySlice";
import Swal from "sweetalert2";
import URL from "../../../routes/URLs";
import PageLayout from "../../../layout/PageLayout";
import QualityForm from "../../../components/Forms/QualityForm";

const EditQuality = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, quality } = useSelector((state) => state.quality);

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.editQuality.text,
        path: headerURL.editQuality.path,
      })
    );

    dispatch(fetchService({ pageSize: 5, page: 1 }));
    dispatch(fetchQualityUnits());
    if (id) {
      dispatch(getQualityById(id));
    }
  }, [id, dispatch]);

  const onSubmit = async (data) => {
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

  return (
    <PageLayout className={`h-auto pb-5`}>
      <QualityForm
        initialData={quality}
        isEdit={true}
        loading={loading}
        onCancel={() => navigate(-1)}
        onSubmit={onSubmit}
      />
    </PageLayout>
  );
};

export default EditQuality;
