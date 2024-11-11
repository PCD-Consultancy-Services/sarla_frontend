// Create a separate component or custom React Hook to handle logout and redirection
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { unsetUser } from "../redux/Slices/Auth/AuthSlice";
import URL from "../routes/URLs";

const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOutFunc = () => {
    localStorage.clear();
    dispatch(unsetUser());
    navigate(URL.login);
  };

  return logOutFunc;
};

export default useLogout;
