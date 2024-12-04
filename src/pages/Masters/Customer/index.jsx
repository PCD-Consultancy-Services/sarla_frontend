import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import headerURL from "../../headerURL";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { useNavigate, useParams } from "react-router-dom";
import URL from "../../../routes/URLs";
import {
  createCustomer,
  getCustomerById,
  updateCustomer,
} from "../../../redux/Slices/Master/CustomerSlice";
import Swal from "sweetalert2";
import PageLayout from "../../../layout/PageLayout";
import CustomerForm from "../../../components/Forms/CustomerForm";

const Customer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  useEffect(() => {
    const headerConfig = isEditing
      ? headerURL.editCustomer
      : headerURL.addCustomer;
    dispatch(textState({ text: headerConfig.text, path: headerConfig.path }));

    if (isEditing) {
      dispatch(getCustomerById(id));
    }
  }, [id, dispatch]);

  const { customer, loading } = useSelector((state) => state.customer);

  const handleUpdateCustomer = async (data) => {
    try {
      const response = await dispatch(updateCustomer({ id, data })).unwrap();
      Swal.fire({
        title: "Success!",
        text: response.message || "Customer update successful.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewAllCustomer);
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

  const handleAddCustomer = async (customerData) => {
    try {
      const response = await dispatch(createCustomer(customerData)).unwrap();

      Swal.fire({
        title: "Success!",
        text: response.message || "Customer creation successful.",
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        navigate(URL.viewAllCustomer);
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
        onSubmit={isEditing ? handleUpdateCustomer : handleAddCustomer}
        initialData={isEditing ? customer : null}
        loading={loading}
        onCancel={() => navigate(URL.viewAllCustomer)}
      />
    </PageLayout>
  );
};

export default Customer;
