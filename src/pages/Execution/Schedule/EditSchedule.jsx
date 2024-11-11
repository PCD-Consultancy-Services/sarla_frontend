import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCardBatches,
  fetchMachines,
  getScheduleById,
  updateSchedule,
} from "../../../redux/Slices/Execution/scheduleSlice";
import URL from "../../../routes/URLs";
import {
  fetchShadeForSchedule,
} from "../../../redux/Slices/Execution/RecipeForSchdule";
import Swal from "sweetalert2";
import PageLayout from "../../../layout/PageLayout";
import ScheduleForm from "../../../components/Forms/ScheduleForm";

const EditSchedule = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();

  const { schedule, loading, machineNames, cardBatches } = useSelector(
    (state) => state.schedule
  );

  const {
    // shades,
    // qualities,
    // customers,
    // recipeTypes,
    recipeId,
    // loading: isrecipeLoading,
  } = useSelector((state) => state.receipeForSchedule);

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.editSchedule.text,
        path: headerURL.editSchedule.path,
      })
    );
    // dispatch(fetchMachines());
    // dispatch(fetchCardBatches());

    dispatch(fetchShadeForSchedule({}));
    dispatch(getScheduleById(id));
  }, [dispatch]);

  const onSubmit = async (scheduleData) => {
    const payload = {
      id,
      data: {
        piNo: scheduleData?.PINo,
        machineId: scheduleData?.machineId,
        cardBatche: scheduleData?.cardBatch,
        rmLotNumber: scheduleData?.RMLotNum,
        finishMaterial: scheduleData?.finishMaterial,
        shadeId: scheduleData?.shadeId,
        qualityId: scheduleData?.qualityId,
        customerId: scheduleData?.customerId,
        recipeType: scheduleData?.recipeType,
        recipeId: recipeId[0]?._id,
        rmMaterial: scheduleData?.qualityId,
        slipNumber: scheduleData?.slipNumber,
        batchWeight: scheduleData?.batchWt,
        cones: scheduleData?.cones,
        remark: scheduleData?.remarks,
        programNo: scheduleData?.programNum,
      },
    };

    const response = await dispatch(updateSchedule(payload));
    // console.log(response);
    if (response.error) {
      Swal.fire({
        title: "Error!",
        text:
          response.payload.message ||
          "Unexpected error, failed to update schedule",
        icon: "error",
        allowOutsideClick: false,
      });
    } else {
      Swal.fire({
        title: "Success!",
        text: response.payload.message || "schedule updated successfully",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => navigate(URL.viewAllSchedule));
    }
  };

  return (
    <PageLayout>
      <ScheduleForm
        initialValues={schedule}
        onSubmit={onSubmit}
        onCancel={() => navigate(URL.viewAllSchedule)}
      />
    </PageLayout>
  );
};

export default EditSchedule;
