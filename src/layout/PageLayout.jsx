import { useSelector } from "react-redux";

const PageLayout = ({ children  , className }) => {
  const condition = useSelector((state) => state.theme.checkCondition);
  const sectionClass = condition.isOpen ? "page-padding" : "normal-padding";

  return (
    <section className={`sky-bg ${className} addCustomerSection ${sectionClass}`}>
      {children}
    </section>
  );
};

export default PageLayout;
