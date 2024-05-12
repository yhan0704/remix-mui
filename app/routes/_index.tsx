import { Button, Typography } from "@mui/material";
import { Link } from "@remix-run/react";
import PageMargin from "~/component/PageMargin";

export default function Index() {
  return (
    <>
      <PageMargin>
        <Typography>First Page</Typography>
        <Button variant="contained">First Page Me</Button>
        <Link to="hello/1">
          <Button variant="contained">First Page Me</Button>
        </Link>
      </PageMargin>
    </>
  );
}
