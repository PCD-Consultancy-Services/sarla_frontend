import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";
import "./profile.css";
import URL from "../../routes/URLs";
import { Button, TextField } from "@mui/material";
import { textState } from "../../redux/Slices/Theme/themeSetting";
import headerURL from "../headerURL";
import { Images } from "../../assets";
import { User } from "../../constants";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const data = JSON.parse(localStorage.getItem(User));
  console.log(data, "data");

  const { register, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        email: data.email,
      });
    }
  }, []);

  const condition = useSelector((state) => state.theme.checkCondition);
  const sectionClass = condition.isOpen ? " page-padding" : "normal-padding";

  return (
    <section className={`sky-bg  a ${sectionClass}`}>
      <Box paddingTop={5} className="profile-box">
        <form action="" className="profile-form">
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
                <label className="formLabel">Name</label>
                <TextField
                  className="formInput"
                  name="name"
                  fullWidth
                  label="User Name"
                  variant="outlined"
                  disabled
                  {...register("name")}
                />
              </div>

              {/* <div className="inp-field">
                <label className="formLabel">Email</label>
                <TextField
                  className="formInput"
                  name="email"
                  fullWidth
                  label="Email"
                  variant="outlined"
                  inputProps={{ readOnly: true }}
                  {...register("email")}
                />
              </div> */}

              <div className="btn-field">
                <Button
                  variant="contained"
                  onClick={() => navigate(`${URL.changePassword}`)}
                  className="me-2"
                >
                  Change Password
                </Button>
                {/* <Button variant="contained" className="formBtn blue-button">
                  Save
                </Button> */}
              </div>
            </Grid>
          </Grid>
        </form>
      </Box>
    </section>
  );
};

export default Profile;
