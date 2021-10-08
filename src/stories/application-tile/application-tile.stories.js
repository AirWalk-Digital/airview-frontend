import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import WarningIcon from "@material-ui/icons/Warning";
import FlagIcon from "@material-ui/icons/Flag";
import Typography from "@material-ui/core/Typography";
import {
  ApplicationTile,
  ApplicationTileHeader,
  ApplicationTileTitle,
  ApplicationTileDivider,
  ApplicationTileContent,
  ApplicationTileContentRow,
  ApplicationTileCallToActionButton,
  ApplicationTileChip,
} from "../../components/application-tile";
import { IconChip } from "../../components/icon-chip";
import { ProgressBar } from "../../components/progress-bar";
import docs from "./application-tile.docs.md";

const config = {
  title: "Modules/Application Tile",
  component: ApplicationTile,
  subcomponents: {
    ApplicationTileHeader,
    ApplicationTileTitle,
    ApplicationTileContent,
    ApplicationTileContentRow,
    ApplicationTileCallToActionButton,
  },
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
  decorators: [
    (story) => {
      const classes = makeStyles(() => ({
        "@global": {
          "#root": {
            flex: 1,
          },
        },
        root: {
          width: "100%",
          maxWidth: 360,
          margin: "0 auto",
          flex: "1 1 auto",
        },
      }))();

      return <div className={classes.root}>{story()}</div>;
    },
  ],
};

const defaultArgTypes = {
  children: {
    control: false,
  },
  classNames: {
    control: false,
  },
};

function WithoutCollapsibleContent(args) {
  /*
  Use React hook to require the Material-UI theme object
  to provide colors to IconChip and ProgressBar sub-components
  */
  const theme = useTheme();

  return (
    <ApplicationTile gutter={args.gutter} classNames={args.classNames}>
      <ApplicationTileHeader
        leftContent={
          <ApplicationTileTitle>Application One</ApplicationTileTitle>
        }
        rightContent={
          <ApplicationTileCallToActionButton href="/" label="View" />
        }
      />

      <ApplicationTileContent>
        <ApplicationTileContentRow>
          <ApplicationTileTitle>Production</ApplicationTileTitle>

          <ApplicationTileContentRow inlineContent>
            <ApplicationTileChip
              tooltipLabel="Low Impact Resources"
              icon={<WarningIcon />}
              label="2"
              dense
              color={theme.palette.success.main}
            />

            <ApplicationTileChip
              tooltipLabel="Medium Impact Resources"
              icon={<WarningIcon />}
              label="2"
              dense
              color={theme.palette.warning.main}
            />

            <ApplicationTileChip
              tooltipLabel="High Impact Resources"
              icon={<WarningIcon />}
              label="2"
              dense
              color={theme.palette.error.main}
            />

            <ApplicationTileChip
              tooltipLabel="Exempt Resources"
              icon={<WarningIcon />}
              label="2"
              dense
              color={theme.palette.grey["800"]}
            />
          </ApplicationTileContentRow>

          <ProgressBar value={80} color={theme.palette.success.main} />
        </ApplicationTileContentRow>
      </ApplicationTileContent>
    </ApplicationTile>
  );
}

WithoutCollapsibleContent.argTypes = {
  ...defaultArgTypes,
};

function WithCollapsibleContent(args) {
  /*
  Use React hook to require the Material-UI theme object
  to provide colors to IconChip and ProgressBar sub-components
  */
  const theme = useTheme();

  return (
    <ApplicationTile gutter={args.gutter} classNames={args.classNames}>
      <ApplicationTileHeader
        leftContent={
          <ApplicationTileTitle>Application One</ApplicationTileTitle>
        }
        rightContent={
          <ApplicationTileCallToActionButton href="/" label="View" />
        }
      />

      <ApplicationTileContent>
        <ApplicationTileContentRow>
          <ApplicationTileTitle size="small" level="h3">
            Production
          </ApplicationTileTitle>

          <ProgressBar value={80} color={theme.palette.success.main} />

          <ApplicationTileTitle size="small" level="h3">
            UAT
          </ApplicationTileTitle>

          <ProgressBar value={40} color={theme.palette.primary.main} />

          <ApplicationTileTitle size="small" level="h3">
            Development
          </ApplicationTileTitle>

          <ProgressBar value={65} color={theme.palette.error.main} />
        </ApplicationTileContentRow>
      </ApplicationTileContent>

      <ApplicationTileDivider />

      <ApplicationTileContent collapsible initialCollapsed={true}>
        <ApplicationTile gutter>
          <ApplicationTileHeader
            dense
            leftContent={
              <ApplicationTileTitle level="h4">Production</ApplicationTileTitle>
            }
          />

          <ApplicationTileContent>
            <ApplicationTileContentRow inlineContent>
              <ApplicationTileChip
                tooltipLabel="Low Impact Resources"
                icon={<WarningIcon />}
                label="2"
                dense
                color={theme.palette.success.main}
              />

              <ApplicationTileChip
                tooltipLabel="Medium Impact Resources"
                icon={<WarningIcon />}
                label="2"
                dense
                color={theme.palette.warning.main}
              />

              <ApplicationTileChip
                tooltipLabel="High Impact Resources"
                icon={<WarningIcon />}
                label="2"
                dense
                color={theme.palette.error.main}
              />

              <ApplicationTileChip
                tooltipLabel="Exempt Resources"
                icon={<WarningIcon />}
                label="2"
                dense
                color={theme.palette.grey["800"]}
              />
            </ApplicationTileContentRow>
          </ApplicationTileContent>
        </ApplicationTile>

        <ApplicationTile gutter>
          <ApplicationTileHeader
            dense
            leftContent={
              <ApplicationTileTitle level="h4">UAT</ApplicationTileTitle>
            }
          />

          <ApplicationTileContent>
            <ApplicationTileContentRow inlineContent>
              <ApplicationTileChip
                tooltipLabel="Low Impact Resources"
                icon={<WarningIcon />}
                label="2"
                dense
                color={theme.palette.success.main}
              />

              <ApplicationTileChip
                tooltipLabel="Medium Impact Resources"
                icon={<WarningIcon />}
                label="2"
                dense
                color={theme.palette.warning.main}
              />

              <ApplicationTileChip
                tooltipLabel="High Impact Resources"
                icon={<WarningIcon />}
                label="2"
                dense
                color={theme.palette.error.main}
              />

              <ApplicationTileChip
                tooltipLabel="Exempt Resources"
                icon={<WarningIcon />}
                label="2"
                dense
                color={theme.palette.grey["800"]}
              />
            </ApplicationTileContentRow>
          </ApplicationTileContent>
        </ApplicationTile>

        <ApplicationTile>
          <ApplicationTileHeader
            dense
            leftContent={
              <ApplicationTileTitle level="h4">
                Development
              </ApplicationTileTitle>
            }
          />

          <ApplicationTileContent>
            <ApplicationTileContentRow inlineContent>
              <ApplicationTileChip
                tooltipLabel="Low Impact Resources"
                icon={<WarningIcon />}
                label="2"
                dense
                color={theme.palette.success.main}
              />

              <ApplicationTileChip
                tooltipLabel="Medium Impact Resources"
                icon={<WarningIcon />}
                label="2"
                dense
                color={theme.palette.warning.main}
              />

              <ApplicationTileChip
                tooltipLabel="High Impact Resources"
                icon={<WarningIcon />}
                label="2"
                dense
                color={theme.palette.error.main}
              />

              <ApplicationTileChip
                tooltipLabel="Exempt Resources"
                icon={<WarningIcon />}
                label="2"
                dense
                color={theme.palette.grey["800"]}
              />
            </ApplicationTileContentRow>
          </ApplicationTileContent>
        </ApplicationTile>
      </ApplicationTileContent>
    </ApplicationTile>
  );
}

WithCollapsibleContent.argTypes = {
  ...defaultArgTypes,
};

function WithNoData(args) {
  return (
    <ApplicationTile>
      <ApplicationTileHeader
        leftContent={
          <ApplicationTileTitle>Application One</ApplicationTileTitle>
        }
        rightContent={
          <ApplicationTileCallToActionButton href="/" label="View" />
        }
      />
      <ApplicationTileContent>
        <ApplicationTileContentRow>
          <Typography align="center" variant="body2">
            You do not have the required permissions to view this data
          </Typography>
        </ApplicationTileContentRow>
      </ApplicationTileContent>
    </ApplicationTile>
  );
}

export default config;
export { WithoutCollapsibleContent, WithCollapsibleContent, WithNoData };
