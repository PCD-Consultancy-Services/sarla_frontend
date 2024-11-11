import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Button, CircularProgress } from "@mui/material"; // Import CircularProgress
import { Images } from "../../../assets";
import styles from "../auth.module.css";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { forgetPassword } from "../../../redux/Slices/Auth/ForgetPassword";
import { forgetPasswordschema } from "../../../validators/auth.validations";
import URL from "../../../routes/URLs";

const ForgetPassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgetPasswordschema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.forgetPassword);

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(forgetPassword(data.email)).unwrap();
      Swal.fire({
        title: "Success!",
        text: response.message || "Service creation successful.",
        icon: "success",
        allowOutsideClick: false,
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
    <section className={`${styles.forgetPassSection} ${styles.authSection}`}>
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
              <img className={styles.icon} src={Images.logo} alt="sarla Icon" />

              <div className={styles.formHeading}>
                <h1 className={styles.formHeadingText}>Forgot Password</h1>
                <p className={styles.formHeadingLabel}>
                  Enter your email to reset your password
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="formInput">
                  <label className="formLabel">
                    Email<span className="startColor">*</span>
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Enter your registered email"
                        variant="outlined"
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ""}
                      />
                    )}
                  />
                </div>

                <div className={styles.formBtnDiv}>
                  <Button
                    variant="contained"
                    type="submit"
                    className="mt-4 w-100 py-3"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Submit"}
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

export default ForgetPassword;
