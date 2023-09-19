import axios from "axios";

export const insertMovieCommentDB = async (commentData) => {
  console.log(commentData);
  try {
    const res = await axios.post(
      "https://101.101.219.216:8443/contents/movieDetail/insertMovieComment",
      commentData
    );
    return res.data;
  } catch (error) {
    console.error("Error : ", error);
    throw error;
  }
};

export const updateMovieCommentDB = async (commentData) => {
  console.log(commentData);
  try {
    const res = await axios.post(
      "https://101.101.219.216:8443/contents/movieDetail/updateMovieComment",
      commentData
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error : ", error);
    throw error;
  }
};

export const deleteMovieCommentDB = async (commentData) => {
  console.log(commentData);
  try {
    const res = await axios.post(
      "https://101.101.219.216:8443/contents/movieDetail/deleteMovieComment",
      commentData
    );
    return res.data;
  } catch (error) {
    console.error("Error : ", error);
    throw error;
  }
};

export const getMovieCommentDB = async (movieId, movieSeq) => {
  try {
    const res = await axios.get(
      "https://101.101.219.216:8443/contents/movieDetail/getMovieComment",
      {
        params: {
          movieId: movieId,
          movieSeq: movieSeq,
        },
      }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error : ", error);
    throw error;
  }
};

export const getUserMovieCommentDB = async (movieId, movieSeq, userId) => {
  try {
    const res = await axios.get(
      "https://101.101.219.216:8443/contents/movieDetail/getUserMovieComment",
      {
        params: {
          movieId: movieId,
          movieSeq: movieSeq,
          userId: userId,
        },
      }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error : ", error);
    throw error;
  }
};

{/* 보관함 로직 */}
export const addToArchiveDB = async (archiveData) => {
  console.log(archiveData);
  try {
    const res = await axios.post(
      "https://101.101.219.216:8443/contents/archive/addToArchive",
      archiveData
    );
    return res.data;
  } catch (error) {
    console.error("Error : ", error);
    throw error;
  }
};

export const deleteToArchiveDB = async (archiveData) => {
  console.log(archiveData);
  try {
    const res = await axios.post(
      "https://101.101.219.216:8443/contents/archive/deleteToArchive",
      archiveData
    );
    return res.data;
  } catch (error) {
    console.error("Error : ", error);
    throw error;
  }
};

export const checkMovieArchiveDB = async (movieId, movieSeq ,userId) => {
  try {
    const res = await axios.get(
      "https://101.101.219.216:8443/contents/archive/checkMovieArchive",
      {
        params: {
          movieId: movieId,
          movieSeq: movieSeq,
          userId: userId
        },
      }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error : ", error);
    throw error;
  }
};

export const getUserArchiveDB = async (userId) => {
  try {
    const res = await axios.get(
      "https://101.101.219.216:8443/contents/archive/getUserArchive",
      {
        params: {
          userId: userId
        },
      }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error : ", error);
    throw error;
  }
};


