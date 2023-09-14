import { createContext, useContext, useState } from "react";

const movieDetailContext = createContext();

export const MovieProvider = ({ children }) => {
  const [updatedComments, setUpdatedComments] = useState([]);

  return (
    <movieDetailContext.Provider
      value={{ updatedComments, setUpdatedComments }}
    >
      {children}
    </movieDetailContext.Provider>
  );
};

export const useMovieContext = () => {
  return useContext(movieDetailContext);
};
