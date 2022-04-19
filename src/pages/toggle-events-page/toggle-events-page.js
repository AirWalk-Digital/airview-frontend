import React from "react";
import PropTypes from "prop-types";
import { LayoutBase } from "../../components/layout-base";
import siteConfig from "../../site-config.json";

import Switch from "@material-ui/core/Switch";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import { Button, FormLabel } from "@material-ui/core";
import { useState } from "react";

import { useApiService } from "../../hooks/use-api-service/use-api-service";

const defaultEvent = {
  application: "Vulnerability Mgmt App",
  resource: "y",
  resource_type: "storage",
  control_type: "incident",
  is_active: false,
};

function ToggleSwitch({ control, resource, onHandleToggle, state, id }) {
  return (
    <Switch
      checked={state || false}
      onChange={() => onHandleToggle(control, resource, state, id)}
      name="Limited exemption"
      color="primary"
      edge="start"
    />
  );
}
function ToggleBlock({ control, setToggle, state }) {
  const thisState = state[control] || {};

  return (
    <React.Fragment>
      <Grid item xs={4}>
        <FormLabel>{control}</FormLabel>
      </Grid>
      <Grid item xs={2}>
        <ToggleSwitch
          control={control}
          resource={"demo-s3-bucket-one"}
          onHandleToggle={setToggle}
          id={"1"}
          state={thisState["1"]}
        />
      </Grid>
      <Grid item xs={2}>
        <ToggleSwitch
          control={control}
          resource={"demo-s3-bucket-two"}
          onHandleToggle={setToggle}
          id={"2"}
          state={thisState["2"]}
        />
      </Grid>
      <Grid item xs={2}>
        <ToggleSwitch
          control={control}
          resource={"demo-s3-bucket-three"}
          onHandleToggle={setToggle}
          id={"3"}
          state={thisState["3"]}
        />
      </Grid>
      <Grid item xs={2}>
        <ToggleSwitch
          control={control}
          resource={"demo-s3-bucket-four"}
          onHandleToggle={setToggle}
          id={"4"}
          state={thisState["4"]}
        />
      </Grid>
    </React.Fragment>
  );
}

function ToggleComponent() {
  const apiService = useApiService();
  const [state, setState] = useState({});
  const handleClear = async () => {
    await apiService("/api/shim/exclusions", "DELETE");
    setState({});
  };

  const handleToggle = async (control, resource, active, id) => {
    const current = state;
    const block = current[control] || {};
    block[id] = !active;
    const event = {
      ...defaultEvent,
      resource,
      control_name: control,
      is_active: block[id],
    };
    await (
      await apiService(`/api/shim/compliance-events`, "PUT", event)
    ).data.text();

    current[control] = block;
    setState({ ...current });
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={4} />
        <Grid item xs={2}>
          <FormLabel>{"Bucket One"}</FormLabel>
        </Grid>
        <Grid item xs={2}>
          <FormLabel>{"Bucket Two"}</FormLabel>
        </Grid>
        <Grid item xs={2}>
          <FormLabel>{"Bucket Three"}</FormLabel>
        </Grid>
        <Grid item xs={2}>
          <FormLabel>{"Bucket Four"}</FormLabel>
        </Grid>
        <ToggleBlock
          control="S3 Block Public Bucket"
          setToggle={handleToggle}
          state={state}
        />
        <ToggleBlock
          control="S3 Bucket Has External Replication"
          setToggle={handleToggle}
          state={state}
        />
        <ToggleBlock
          control="IAM Role Has Inline Policy"
          setToggle={handleToggle}
          state={state}
        />
      </Grid>
      <Button variant="contained" onClick={handleClear}>
        Clear All
      </Button>
    </Box>
  );
}

export function ToggleEventsPage() {
  const pageProps = {
    currentRoute: "/toggle-events",
    pageTitle: "Toggle Events",
    siteTitle: siteConfig.siteTitle,
    version: siteConfig.version,
    logoSrc: siteConfig.theme.logoSrc,
    navItems: [],
    onQueryChange: () => {},
    loading: false,
    previewMode: false,
    breadcrumbLinks: [],
  };
  return (
    <LayoutBase pageProps={pageProps}>
      <ToggleComponent />
    </LayoutBase>
  );
}

ToggleSwitch.propTypes = {
  control: PropTypes.string,
  resource: PropTypes.string,
  onHandleToggle: PropTypes.func,
  state: PropTypes.object,
  id: PropTypes.string,
};

ToggleBlock.propTypes = {
  control: PropTypes.string,
  setToggle: PropTypes.func,
  state: PropTypes.object,
};
