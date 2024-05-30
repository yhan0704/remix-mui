import { Typography } from "@mui/material";
import { json, useLoaderData } from "@remix-run/react";
import PageMargin from "~/component/PageMargin";
import SwiperCarousel from "~/component/SwiperCarousel";
export async function loader() {
  const popular =
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
  const upComming =
    "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1";
  const topRate =
    "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";

  const fetchData = async (url: string) => {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `${process.env.SOME_SECRET}`,
      },
    });
    if (!res.ok) {
      throw new Response("Failed to fetch data", { status: res.status });
    }
    return res.json();
  };

  const [popularData, upCommingData, topRateData] = await Promise.all([
    fetchData(popular),
    fetchData(upComming),
    fetchData(topRate),
  ]);

  return json({ popularData, upCommingData, topRateData });
}

export default function Index() {
  const nowPlayingMovies = useLoaderData<typeof loader>();

  const popularMovie = nowPlayingMovies.popularData.results;
  const upCommingMovie = nowPlayingMovies.upCommingData.results;
  const topRateMovie = nowPlayingMovies.topRateData.results;

  return (
    <PageMargin>
      <Typography variant="h6" style={{ textAlign: "center" }}>
        Popular Movies:
      </Typography>
      <SwiperCarousel popularMovie={popularMovie} />
      <Typography
        variant="h6"
        style={{ textAlign: "center", marginTop: "100px" }}
      >
        Up Comming Movies:
      </Typography>
      <SwiperCarousel popularMovie={upCommingMovie} />
      <Typography
        variant="h6"
        style={{ textAlign: "center", marginTop: "100px" }}
      >
        Top Rate Movies:
      </Typography>
      <SwiperCarousel popularMovie={topRateMovie} />
    </PageMargin>
  );
}
