import React from "react";
import { Grid, Typography } from "@mui/material";
import formatDate from "../../../utils/formatDate";

const DispensingDetails = ({ details }) => {
  // console.log(details);
  const fields = [
    { field: "PI_No", label: "PI No.", value: details?.data?.piNo || "-" },
    {
      field: "machine",
      label: "Machine",
      value: details?.data.machineId?.name || "-",
    },
    {
      field: "customer",
      label: "Customer",
      value: `${details?.data.customerId?.name} - ${details?.data.customerId.custCode}` || "-",
    },
    {
      field: "shadeNo",
      label: "Shade No",
      value:
        `${details?.data.shadeId?.shadeCode} - ${details?.data.shadeId?.color}` ||
        "-",
    },
    {
      field: "slip_no",
      label: "Slip No",
      value: details?.data.slipNumber || "-",
    },
    {
      field: "quality",
      label: "Quality",
      value:
        `${details?.data.qualityId?.qualityCode} - ${details?.data?.qualityId.qualityCodeManual}` ||
        "-",
    },
    {
      field: "rmLotNo",
      label: "RM Lot No",
      value: details?.data.rmLotNumber || "-",
    },
    {
      field: "batchWeight",
      label: "Batch Weight",
      value: details?.data.batchWeight || "-",
    },
    { field: "cones", label: "Cones", value: details?.data.cones || "-" },
    {
      field: "programNo",
      label: "Program No",
      value: details?.data.programNo || "-",
    },
    {
      field: "recipeType",
      label: "Recipe Type",
      value: details?.data.recipeType || "-",
    },
    {
      field: "literage",
      label: "Literage",
      value: details.data.machineId.literage || "-",
    },
    {
      field: "Created_At",
      label: "Created At",
      value: formatDate(details.data.createdAt) || "-",
    },
  ];

  return (
    <Grid container spacing={2}>
      {fields.map(({ field, label, value }) => (
        <Grid item xs={6} key={field} className="d-flex align-items-center">
          <Typography className="formLabel  w125" variant="body1">
            {label} :
          </Typography>
          <Typography className="w-50 " variant="body1" sx={{ paddingLeft: 2 }}>
            {value}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export default DispensingDetails;
