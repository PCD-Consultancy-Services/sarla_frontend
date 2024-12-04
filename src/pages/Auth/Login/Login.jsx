import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import { Images } from "../../../assets";
import styles from "../auth.module.css";
import { login } from "../../../redux/Slices/Auth/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../../validators/auth.validations";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const onSubmit = async (formData) => {
    try {
      const response = await dispatch(login(formData)).unwrap();
      Swal.fire({
        title: "Success!",
        text: response.message || "Login successful.",
        icon: "success",
        allowOutsideClick: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Unexpected error, failed to login",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <section className={styles.loginSection}>
      <Box height={"100%"}>
        <Grid container spacing={2} height={"100%"} className={styles.mainGrid}>
          <Grid item xs={6} className={styles.imageContainer}>
            <img
              src={Images.logo}
              onClick={() => navigate("/")}
              className={styles.authLogo}
              alt="Sarla Icon"
            />
          </Grid>
          <Grid item xs={6} sm={6} className={styles.allCenter}>
            <div className={styles.innerContent}>
              <img className={styles.icon} src={Images.logo} alt="Sarla Icon" />

              <div className={styles.formHeading}>
                <h1 className={styles.formHeadingText}>Sign In</h1>
                <p className={styles.formHeadingLabel}>
                  Enter your email and password to sign in!
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="formInput">
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email"
                        id="fullWidth"
                        variant="outlined"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </div>

                <div className="formInput">
                  <FormControl
                    variant="outlined"
                    fullWidth
                    className="formInput"
                    error={!!errors.password}
                  >
                    <InputLabel
                      htmlFor="outlined-adornment-password"
                      error={!!errors.password}
                    >
                      Password
                    </InputLabel>
                    <Controller
                      name="password"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <OutlinedInput
                          {...field}
                          id="outlined-adornment-password"
                          type={showPassword ? "text" : "password"}
                          error={!!errors.password}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={(e) => e.preventDefault()}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Password"
                        />
                      )}
                    />
                    <FormHelperText>{errors.password?.message}</FormHelperText>
                  </FormControl>
                </div>

                <div className={styles.linkDiv}>
                  <div className="loogedIn">
                    {/* <Checkbox defaultChecked />
                    <label className={styles.label} htmlFor="">
                      Keep me logged in
                    </label> */}
                  </div>
                  <div className={`${styles.forgetLink} mt-3`}>
                    <Link to={"/forgetPassword"}>Forgot password?</Link>
                  </div>
                </div>
                <div className={styles.formBtnDiv}>
                  <Button
                    variant="contained"
                    type="submit"
                    className="w-100 py-3 mt-4"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress /> : "Login"}
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

export default Login;
