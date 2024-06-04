export async function fetchMovieDatail( url:string) {
  const apiUrl =url;
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
