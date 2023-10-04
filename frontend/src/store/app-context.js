import { createContext } from "react";

const AppContext = createContext({
  isFileUploaded: false,
  isThereAnyError: false,
  uploadFile: () => {},
  changeErrorStatus: () => {},
  file: null,
});

export default AppContext;
