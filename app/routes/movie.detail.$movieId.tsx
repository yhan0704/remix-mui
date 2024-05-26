import { Typography } from "@mui/material";
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

  return (
    <PageMargin>
      <Typography>{movieDetail.original_title}</Typography>
    </PageMargin>
  );
}
