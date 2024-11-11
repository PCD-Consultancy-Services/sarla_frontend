import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Button, TextField } from "@mui/material";
import "./profile.css";
import { Images } from "../../assets";
import { changePasswordschema } from "../../validators/auth.validations";
import { changePassword } from "../../redux/Slices/Auth/changePassword";

const ChangePassword = () => {
  const condition = useSelector((state) => state.theme.checkCondition);
  const sectionClass = condition.isOpen ? " page-padding" : "normal-padding";

  const { loading } = useSelector((state) => state.changePassword);

  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordschema),
  });

  const onSubmit = async (data) => {
    try {
      const { oldPassword, newPassword } = data;
      console.log(newPassword, "newPassword");
      const response = await dispatch(
        changePassword({ oldPassword, newPassword })
      ).unwrap();
      console.log(response, "response");

      Swal.fire({
        title: "Success!",
        text: response.message || "Password changed successfully.",
        icon: "success",
        allowOutsideClick: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Password change failed.",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <section className={`sky-bg ${sectionClass}`}>
      <Box paddingTop={5} className="profile-box">
        <form className="profile-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid
            className="page-list-table"
            container
            direction="center"
            spacing={2}
            bgcolor={"white"}
            borderRadius={"15px"}
            padding={"15px"}
          >
            <Grid item xs={12}>
              <div className="bg-img-div">
                <img src={Images.sarla} alt="" />
              </div>
            </Grid>

            <Grid item xs={12} className="profile-inp">
              <div className="inp-field">
                <label className="formLabel">Old Password</label>
                <Controller
                  name="oldPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="formInput"
                      fullWidth
                      label="Old Password"
                      type="password"
                      variant="outlined"
                      error={!!errors.oldPassword}
                      helperText={errors.oldPassword?.message}
                    />
                  )}
                />
              </div>

              <div className="inp-field">
                <label className="formLabel">New Password</label>
                <Controller
                  name="newPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="formInput"
                      fullWidth
                      label="New Password"
                      type="password"
                      variant="outlined"
                      error={!!errors.newPassword}
                      helperText={errors.newPassword?.message}
                    />
                  )}
                />
              </div>

              <div className="inp-field">
                <label className="formLabel">Confirm Password</label>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="formInput"
                      fullWidth
                      label="Confirm Password"
                      type="password"
                      variant="outlined"
                      // error={!!errors.confirmPassword}
                      // helperText={errors.confirmPassword?.message}
                    />
                  )}
                />
              </div>

              <Button
                variant="contained"
                className="formBtn blue-button mb-3"
                type="submit"
                disabled={loading} // Disable while loading
              >
                {loading ? "Changing..." : "Reset Password"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </section>
  );
};

export default ChangePassword;
