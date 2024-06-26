export async function fetchNowPlayingMovies() {
    const apiUrl =
    "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1";
    const res = await fetch(apiUrl, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `${process.env.SOME_SECRET}`,
    },
  })

    if (!res.ok) {
      throw new Error("Failed to fetch now playing movies");
    }

    
    const data = res.json()
    return data
  }