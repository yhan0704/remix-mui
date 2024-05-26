export async function fetchMovieDatail(movieId:string) {
    const apiUrl =
    `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
    const res = await fetch(apiUrl, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `${process.env.SOME_SECRET}`,
    },
  })
    
    const data =  res.json()
    return data
  }