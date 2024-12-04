
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { Images } from "../../../assets";
import styles from "../auth.module.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { resetPassword } from "../../../redux/Slices/Auth/ResetPassword";
import { resetPasswordschema } from "../../../validators/auth.validations";
import URL from "../../../routes/URLs";

const ResetPassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordschema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const onSubmit = async (data) => {
    try {
      const token = searchParams.get("token");


      const response = await dispatch(
        resetPassword({ token, newPassword: data.newPassword })
      ).unwrap();
     

      Swal.fire({
        title: "Success!",
        text: response.message || "Service creation successful.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.login);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Unexpected error, failed to create service",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <section className={styles.resetPassSection + " " + styles.authSection}>
      <Box height={"100%"}>
        <Grid container spacing={2} height={"100%"}>
          <Grid item xs={6} className={styles.imageContainer}>
            <img
              src={Images.logo}
              onClick={() => navigate("/")}
              className={styles.authLogo}
              alt="Sarla Icon"
            />
          </Grid>
          <Grid item xs={6} className={styles.allCenter}>
            <div className={styles.innerContent}>
              <img className={styles.icon} src={Images.logo} alt="Sarla Icon" />

              <div className={styles.formHeading}>
                <h1 className={styles.formHeadingText}>Reset Password</h1>
                <p className={styles.formHeadingLabel}>Create new password</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="formInput">
                  <label className="formLabel mb-2">
                    New Password<span className=".startColor">*</span>
                  </label>
                  <Controller
                    name="newPassword"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="New Password"
                        variant="outlined"
                        type="password"
                        error={!!errors.newPassword}
                        helperText={errors.newPassword?.message}
                      />
                    )}
                  />
                </div>

                <div className="formInput">
                  <label className="formLabel mb-2">
                    Confirm New Password
                    <span className="startColor">*</span>
                  </label>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Confirm Password"
                        variant="outlined"
                        type="password"
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                      />
                    )}
                  />
                </div>

                <div className={styles.formBtnDiv}>
                  <Button
                    variant="contained"
                    type="submit"
                    className="mt-3 py-3 w-100"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </Grid>
        </Grid>
      </Box>
    </section>
  );
};

export default ResetPassword;
