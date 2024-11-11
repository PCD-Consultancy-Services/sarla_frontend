import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { scheduleValidationSchema } from "../../../validators/scheduleValidation";
import { useForm } from "react-hook-form";
import {
  createSchedule,
  fetchCardBatches,
  fetchMachines,
} from "../../../redux/Slices/Execution/scheduleSlice";
import URL from "../../../routes/URLs";
import {
  fetchCustomerForSchedule,
  fetchQualityForSchedule,
  fetchRecipeIdForSchedule,
  fetchRecipeTypeForSchedule,
  fetchShadeForSchedule,
} from "../../../redux/Slices/Execution/RecipeForSchdule";
import Swal from "sweetalert2";
import { removeDuplicates } from "../../../utils/removeDuplicateData";
import { getSlipNumByCardBatch } from "../../../redux/Slices/Execution/SlipNumSlice";
import PageLayout from "../../../layout/PageLayout";
import ScheduleForm from "../../../components/Forms/ScheduleForm";

const AddSchedule = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        text: headerURL.addSchedule.text,
        path: headerURL.addSchedule.path,
      })
    );
    // dispatch(fetchMachines());
    // dispatch(fetchCardBatches());

    dispatch(fetchShadeForSchedule({}));
  }, [dispatch]);

  const onSubmit = async (scheduleData) => {
    const payload = {
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
    };

    const response = await dispatch(createSchedule(payload));

    if (response.error) {
      Swal.fire({
        title: "Error!",
        text:
          response.payload.message ||
          "Unexpected error, failed to create schedule",
        icon: "error",
        allowOutsideClick: false,
      });
    } else {
      Swal.fire({
        title: "Success!",
        text: response.payload.message || "schedule created successfully",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => navigate(URL.viewAllSchedule));
    }
  };

  return (
    <PageLayout>
      <ScheduleForm
        // loading= {loading}
        onSubmit={onSubmit}
        onCancel={() => navigate(URL.viewAllSchedule)}
      />
    </PageLayout>
  );
};

export default AddSchedule;
