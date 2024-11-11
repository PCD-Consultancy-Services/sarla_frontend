import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { useNavigate } from "react-router-dom";
import { fetchService } from "../../../redux/Slices/Master/ServiceSlice";
import { fetchQualityUnits } from "../../../redux/Slices/Master/QualityUnits";
import { createQuality } from "../../../redux/Slices/Master/QualitySlice";
import Swal from "sweetalert2";
import URL from "../../../routes/URLs";
import PageLayout from "../../../layout/PageLayout";
import QualityForm from "../../../components/Forms/QualityForm";

function AddQuality() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.quality);

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.addQuality.text,
        path: headerURL.addQuality.path,
      })
    );

    dispatch(fetchService({ pageSize: 5, page: 1 }));
    dispatch(fetchQualityUnits());
  }, [dispatch]);

  const onSubmit = async (data) => {
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
      <QualityForm loading={loading} onCancel={() => navigate(-1)} onSubmit={onSubmit} />
    </PageLayout>
  );
}

export default AddQuality;
