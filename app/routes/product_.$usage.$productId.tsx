import { Button, Typography } from "@mui/material";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import PageMargin from "~/component/PageMargin";

export async function loader({ params }: LoaderFunctionArgs) {
  const { usage, productId } = params;

  if (!usage || !productId) {
    throw new Response("Not found", { status: 404 });
  }

  return json({ usage: "home-kit", productId: "1" });
}

export default function CartDetail() {
  return (
    <PageMargin>
      <Typography>About</Typography>
      <Button variant="contained">About Me</Button>
    </PageMargin>
  );
}
