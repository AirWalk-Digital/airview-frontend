import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { ControlOverviewHeader } from "./control-overview-header";
import { ControlOverviewGroup } from "./control-overview-group";
import { ControlOverviewItem } from "./control-overview-item";
import { Message } from "../message";
import { ControlOverviewItemDetail } from "./control-overview-item-detail";
import { ControlOverviewItemResources } from "./control-overview-item-resources";
import { ControlOverviewLoadingIndicator } from "./control-overview-loading-indicator";
import Box from "@material-ui/core/Box";

export function ControlOverview({
  title,
  data,
  onRequestOfControlsData,
  onRequestOfResourcesData,
}) {
  const theme = useTheme();

  const errorMessage = (
    <Message
      title="Error"
      message="Error message"
      borderColor={theme.palette.error.main}
    />
  );

  const noIssuesMessage = (
    <Message
      title="No issues"
      message="No issues message"
      borderColor={theme.palette.success.main}
    />
  );

  if (!data || !data.groups || data.groups === "loading")
    return <ControlOverviewLoadingIndicator padding />;

  if (data.groups === "error") return errorMessage;

  if (Array.isArray(data.groups)) {
    if (data.groups.length < 1) return noIssuesMessage;

    return (
      <Paper elevation={1}>
        <ControlOverviewHeader title={title} />

        {data.groups.map((group) => {
          return (
            <ControlOverviewGroup
              groupTitle={group.title}
              id={group.id}
              onChange={onRequestOfControlsData}
              key={group.id}
            >
              {(() => {
                if (
                  !data.controls ||
                  !data.controls[group.id] ||
                  data.controls[group.id] === "loading"
                ) {
                  return <ControlOverviewLoadingIndicator padding />;
                }

                if (data.controls[group.id] === "error") {
                  return <Box padding={2}>{errorMessage}</Box>;
                }

                if (Array.isArray(data.controls[group.id])) {
                  if (data.controls[group.id].length < 1) {
                    return <Box padding={2}>{noIssuesMessage}</Box>;
                  }

                  return data.controls[group.id]?.map((control) => {
                    return (
                      <ControlOverviewItem
                        id={control.id}
                        name={control.name}
                        severity={control.severity}
                        applied={control.applied}
                        exempt={control.exempt}
                        onChange={onRequestOfResourcesData}
                        key={control.id}
                      >
                        <ControlOverviewItemDetail
                          control={control.control}
                          frameworks={control.frameworks}
                          controlType={control.controlType}
                          lifecycle={control.lifecycle}
                        />

                        {(() => {
                          if (
                            !data.resources ||
                            !data.resources[control.id] ||
                            data.resources[control.id] === "loading"
                          ) {
                            return <ControlOverviewLoadingIndicator />;
                          }

                          if (data.resources[control.id] === "error") {
                            return <Box paddingTop={1}>{errorMessage}</Box>;
                          }

                          if (Array.isArray(data.resources[control.id])) {
                            if (data.resources[control.id].length < 1) {
                              return (
                                <Box paddingTop={1}>{noIssuesMessage}</Box>
                              );
                            }

                            return (
                              <ControlOverviewItemResources
                                resourcesData={data.resources[control.id]}
                              />
                            );
                          }
                        })()}
                      </ControlOverviewItem>
                    );
                  });
                }
              })()}
            </ControlOverviewGroup>
          );
        })}
      </Paper>
    );
  }
}

ControlOverview.propTypes = {
  /**
   * Sets the title for the component
   */
  title: PropTypes.string,
  /**
   * Sets the required data to render the component UI
   */
  data: PropTypes.shape({
    groups: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          title: PropTypes.string,
        })
      ),
      PropTypes.oneOf(["error", "loading"]),
    ]),

    controls: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            severity: PropTypes.oneOf(["Low", "Medium", "High"]),
            applied: PropTypes.number,
            exempt: PropTypes.number,
            control: PropTypes.shape({
              name: PropTypes.string,
              url: PropTypes.string,
            }),
            frameworks: PropTypes.arrayOf(
              PropTypes.shape({
                name: PropTypes.string,
                url: PropTypes.string,
              })
            ),
            controlType: PropTypes.string,
            lifecycle: PropTypes.string,
          })
        ),
        PropTypes.oneOf(["error", "loading"]),
      ])
    ),

    resources: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number,
            type: PropTypes.string,
            reference: PropTypes.string,
            environment: PropTypes.string,
            lastSeen: PropTypes.string,
            status: PropTypes.oneOf(["Monitoring", "Non-Compliant", "Exempt"]),
            pending: PropTypes.bool,
          })
        ),
        PropTypes.oneOf(["error", "loading"]),
      ])
    ),
  }),
  /**
   * Callback for when a user expands a control group and a request is made to fetch the controls for that group. **Signature:** `function(groupId: int) => void`
   */
  onRequestOfControlsData: PropTypes.func,
  /**
   * Callback for when a user expands a control within a given group and a request is made to fetch the resource data for that control. **Signature:** `function(controlId: int) => void`
   */
  onRequestOfResourcesData: PropTypes.func,
};
