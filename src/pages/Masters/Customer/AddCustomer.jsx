import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import URL from "../../../routes/URLs";
import { useLocation, useNavigate } from "react-router-dom";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import headerURL from "../../headerURL";
import { createCustomer } from "../../../redux/Slices/Master/CustomerSlice";
import PageLayout from "../../../layout/PageLayout";
import CustomerForm from "../../../components/Forms/CustomerForm";

const AddCustomer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    if (location.state?.from) {
      console.log(location?.state?.from, "----------------");
      navigate(location.state.from);
    } else {
      navigate("/");
    }
  };
  const { loading } = useSelector((state) => state.customer);

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.addCustomer.text,
        path: headerURL.addCustomer.path,
      })
    );
  }, [dispatch]);

  const onSubmit = async (customerData) => {
    try {
      const response = await dispatch(createCustomer(customerData)).unwrap();

      Swal.fire({
        title: "Success!",
        text: response.message || "Customer creation successful.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewCustomer);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Unexpected error, failed to create customer",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <PageLayout>
      <CustomerForm
        onSubmit={onSubmit}
        loading={loading}
        onCancel={() => goBack()}
      />
    </PageLayout>
  );
};

export default AddCustomer;
