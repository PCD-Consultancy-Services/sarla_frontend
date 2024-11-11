import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { useNavigate, useParams } from "react-router-dom";
import URL from "../../../routes/URLs";
import {
  getCustomerById,
  updateCustomer,
} from "../../../redux/Slices/Master/CustomerSlice";
import Swal from "sweetalert2";
import PageLayout from "../../../layout/PageLayout";
import CustomerForm from "../../../components/Forms/CustomerForm";

const EditCustomer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.editCustomer.text,
        path: headerURL.editCustomer.path,
      })
    );
    dispatch(getCustomerById(id));
  }, [id, dispatch]);

  const { customer, loading } = useSelector((state) => state.customer);

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(updateCustomer({ id, data })).unwrap();
      Swal.fire({
        title: "Success!",
        text: response.message || "Customer update successful.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewCustomer);
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Unexpected error, failed to update customer",
        icon: "error",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <PageLayout>
      <CustomerForm
        onSubmit={onSubmit}
        initialData={!loading && customer}
        loading={loading}
        onCancel={() => navigate(URL.viewAllCustomer)}
      />
    </PageLayout>
  );
};

export default EditCustomer;
