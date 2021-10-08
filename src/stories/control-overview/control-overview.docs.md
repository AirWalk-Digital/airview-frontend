The `ControlOverview` is a presentational component, that is complimented with an optional controller `useControlOverviewController`, which can be used for state management and asynchronous retrival of group, control and instances data.

## Importing the component and controller

```javascript
import {
  ControlOverview,
  useControlOverviewController
} from "@/components/control-overview";
```

## Providing data to thecomponent

The data object used to populate the component is intented to work as a relational table of sub-data, with no data set, the component defaults to a loading state.

The top level data keys are:

- `groups` : Used to populate control groupings within the UI; the data should be an array of groups or a string, to indicate either an error or loading status. Setting the data to an empty array indicates there are no issues for the component to display.
- `controls` : Used to store data for controls; the data should be an object of arrays or a string, to indicate either an error or loading status. The object key should be equal to the group id the data relates to; setting the data to an empty array indicates there are no issues for the specific control.
- `instances` Used to store instance data for a specific control; the data should be an object of arrays or a string, to indicate either an error or loading status. The object key should be equal to the control id the data relates to; setting the data to an empty array indicates there are no instances for the specific control.

## Using the optional controller

The component comes with an optional controller as a custom React hook, that can be used to manage component state and the asynchronous retrival of the required data.

### Initialising

The controller hook accepts one parameter (`string`), to act as an API endpoint to fetch the initial group data. The API should return an empty array or array of objects, equal to the following schema:

```javascript
{
  id: number,
  title: string
}
```

### Return values

The controller hook will return an array containing:

#### State

An object of the current state, used to feed the `data` prop of the `ControlOverview` component.

If the response of the API call is successfull, any subsequent requests to fetch data will be bypassed, to reduce server load and improve performance.

If the response of the API call results in an error, subsequent requests to fetch data will be attempted until a successful response is resolved.

The API should return an empty array or array of objects, equal to the following schema:

```javascript
{
  id: number,
  title: string
}
```

#### Control data setter

A function to set the contol data that accepts two parameters, group id (`int`) and an API endpoint (`string`) that is used to fetch control data specific to the requested group.

If the response of the API call is successfull, any subsequent requests to fetch data will be bypassed, to reduce server load and improve performance.

If the response of the API call results in an error, subsequent requests to fetch data will be attempted until a successful response is resolved.

The API should return an empty array or array of objects, equal to the following schema:

```javascript
{
  id: number,
  name: string,
  severity: 'Low' | 'Medium' | 'High',
  applied: number,
  exempt: number,
  control: {
    name: string,
    url: string
  },
  frameworks: [{
    name: string,
    url: string
  }],
  controlType: string,
  lifecycle: string
}
```

#### Instance data setter

A function to set the instance data that accepts two parameters, control id (`int`) and an API endpoint (`string`) that is used to fetch instance data specific to the requested control.

If the response of the API call is successfull, any subsequent requests to fetch data will be bypassed, to reduce server load and improve performance.

If the response of the API call results in an error, subsequent requests to fetch data will be attempted until a successful response is resolved.

The API should return an empty array or array of objects, equal to the following schema:

```javascript
{
  id: number,
  type: string,
  reference: string,
  environment: string,
  lastSeen: string,
  status: 'Monitoring' | 'Non-Compliant' | 'Exempt'
}
```
