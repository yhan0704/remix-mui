import { Button, Typography } from "@mui/material";
import PageMargin from "~/component/PageMargin";

export default function CartProduct() {
  return (
    <PageMargin>
      <Typography>Price</Typography>
      <Button variant="contained">Price Me</Button>
    </PageMargin>
  );
}
