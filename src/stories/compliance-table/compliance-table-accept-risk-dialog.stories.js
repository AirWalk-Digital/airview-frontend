import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { getRisk } from "../../lib/get-risk";
import { ComplianceTableAcceptRiskDialog } from "../../components/compliance-table/compliance-table-accept-risk-dialog";

const config = {
  title: "Modules/Compliance Table/Compliance Table Accept Risk Dialog",
  component: ComplianceTableAcceptRiskDialog,
};

function Default() {
  // Note: getRisk function can be imported from 'lib'
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOnClose = () => setDialogOpen(false);

  const handleOnAccept = async (formData) => {
    // Do something with the data, typically post to server and await response
    // Here we console log the form data and mock a resoved promise
    console.log(formData);

    return new Promise((resolve) =>
      setTimeout(() => {
        resolve();
      }, 5000)
    );
  };

  const exemptions = [
    {
      id: 1,
      name: "Application 1",
      status: "none",
    },
    {
      id: 2,
      name: "Application 2",
      status: "pending",
    },
    {
      id: 3,
      name: "Application 3",
      status: "none",
    },
  ];

  return (
    <div>
      <Button
        onClick={() => setDialogOpen(true)}
        variant="contained"
        color="primary"
        disableElevation
      >
        Reveal Dialog
      </Button>

      <ComplianceTableAcceptRiskDialog
        open={dialogOpen}
        onClose={handleOnClose}
        onAccept={handleOnAccept}
        exemptions={exemptions}
        applicationId={1}
        impactLevel={getRisk}
      />
    </div>
  );
}

export default config;
export { Default };
