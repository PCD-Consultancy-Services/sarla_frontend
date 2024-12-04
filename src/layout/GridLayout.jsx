import { Grid } from "@mui/material";
import React from "react";

const GridLayout = ({ children , className }) => {
  return (
    <Grid
      container
      spacing={2}
      bgcolor={"white"}
      borderRadius={"15px"}
      padding={"20px"}
      className={`${className}`}
    >
      {children}
    </Grid>
  );
};

export default GridLayout;
