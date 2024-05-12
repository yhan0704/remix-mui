import { Button, Typography } from "@mui/material";
import { Link } from "@remix-run/react";
import PageMargin from "~/component/PageMargin";

export default function Hello() {
  return (
    <>
      <PageMargin>
        <Typography variant="h1">Error!!!ㅋㅋㅋㅋㅋ</Typography>
        <Button variant="contained">Hello world Page Me</Button>
        <Link to="1">
          <Button variant="contained">Hello world Page Me</Button>
        </Link>
      </PageMargin>
    </>
  );
}
