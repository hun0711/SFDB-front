import axios from "axios";
import qs from "qs";

export const top20sfmoviesDB = async () => {
  try {
    const res = await axios.get(`http://localhost:8000/movie/top20SfMovie`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const recommendMoviesDB = async () => {
  try {
    const res = await axios.get(`http://localhost:8000/movie/recommendMovie`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const releaseSoonMovieDB = async () => {
  try {
    const res = await axios.get("http://localhost:8000/movie/releaseSoonMovie");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const todayBoxofficeDB = async () => {
  try {
    const res = await axios.get(
      `http://localhost:8000/movie/todayBoxofficeRank`
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const ottExistanceDB = async (movieSeq) => {
  try {
    const res = await axios.get(`http://localhost:8000/movie/ottExistance`, {
      params: {
        movieSeq: movieSeq,
      },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateBoxofficeDB = async () => {
  try {
    const res = await axios.post(
      `http://localhost:8000/api/movies/updateBoxoffice`
    );
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const movieDetailDB = async (movieId, movieSeq) => {
  try {
    const res = await axios.get(`http://localhost:8000/movie/movieDetail`, {
      params: {
        movieId: movieId,
        movieSeq: movieSeq,
      },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const directorInfoDB = async (directorIds) => {
  try {
    const res = await axios.get(`http://localhost:8000/movie/directorsInfo`, {
      params: {
        directorId: directorIds,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const directorInfoByNameDB = async (directorNm) => {
  try {
    const res = await axios.get(`http://localhost:8000/movie/directorsInfo`, {
      params: {
        directorNm: directorNm,
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const BoxOfficeDetailDB = async (movieId, movieSeq) => {
  try {
    const res = await axios.get(`http://localhost:8000/movie/boxofficeDetail`, {
      params: {
        movieId: movieId,
        movieSeq: movieSeq,
      },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

