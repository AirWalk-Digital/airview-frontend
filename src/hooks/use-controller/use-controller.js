import { useContext } from "react";
import { ControllerProviderContext } from "../../providers/controller-provider";

export const useController = () => useContext(ControllerProviderContext);
