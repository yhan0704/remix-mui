import { Button, Typography } from "@mui/material";
import PageMargin from "~/component/PageMargin";

export default function About() {
  return (
    <PageMargin>
      <Typography>About</Typography>
      <Button variant="contained">About Me</Button>
    </PageMargin>
  );
}
