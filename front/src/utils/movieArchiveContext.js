import { createContext, useContext, useState } from "react";

const movieArchiveContext = createContext();

export const ArchiveProvider = ({ children }) => {
  const [userArchive, setUserArchive] = useState([]);

  return (
    <movieArchiveContext.Provider
      value={{ userArchive, setUserArchive }}
    >
      {children}
    </movieArchiveContext.Provider>
  );
};

export const useMovieArchiveContext = () => {
  return useContext(movieArchiveContext);
};
