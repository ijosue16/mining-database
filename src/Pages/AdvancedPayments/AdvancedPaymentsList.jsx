import React from "react";
import ActionsPagesContainer from "../../components/Actions components/ActionsComponentcontainer";

const AdvancedPaymentsList = () => {
  return (
    <ActionsPagesContainer
      title={"Advanced payments"}
      subTitle={"Advabced payments list"}
      actionsContainer={
        <div>
          Advanced payment list
        </div>
      }
    />
  );
};
export default AdvancedPaymentsList;
