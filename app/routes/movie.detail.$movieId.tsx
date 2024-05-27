import { Typography, useMediaQuery } from "@mui/material";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { fetchMovieDatail } from "~/apis/fetchMovieDatail";
import PageMargin from "~/component/PageMargin";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.movieId, "Missing movieId param");
  const data = await fetchMovieDatail(params.movieId);
  if (data.success === false) {
    throw new Response("Could not find a movie", { status: 404 });
  }
  return json(data);
}

export default function MovideDetail() {
  const movieDetail = useLoaderData<typeof loader>();
  console.log(movieDetail);
  const isSmallScreen = useMediaQuery("(max-width:850px)");
  return (
    <PageMargin>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          minHeight: "calc(100vh - 100px)",
          flexDirection: isSmallScreen ? "column" : "row",
        }}
      >
        <div>
          <img
            alt={movieDetail.poster_path}
            src={"https://image.tmdb.org/t/p/w400/" + movieDetail.poster_path}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "700px",
            marginLeft: isSmallScreen ? "0" : "50px",
            marginTop: isSmallScreen ? "20px" : "0",
            padding: isSmallScreen ? "0 30px" : "0",
          }}
        >
          <Typography style={{ lineHeight: 2.5 }}>
            Title: {movieDetail.original_title}
          </Typography>
          <Typography style={{ lineHeight: 2.5 }}>
            Genres:
            {movieDetail.genres.map((genre: any, index: number) => (
              <span key={genre.id}>
                {genre.name}
                {index < movieDetail.genres.length - 1 ? ", " : ""}
              </span>
            ))}
            <br />
          </Typography>
          <Typography style={{ lineHeight: 2.5 }}>Overview:</Typography>
          <Typography style={{ lineHeight: 2 }}>
            {movieDetail.overview}
          </Typography>
        </div>
      </div>
    </PageMargin>
  );
}
