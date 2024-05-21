import { Button, Typography } from "@mui/material";
import { Link, Outlet } from "@remix-run/react";
import PageMargin from "~/component/PageMargin";

export default function Product() {
  return (
    <>
      <PageMargin>
        <Typography>Cart Page</Typography>
        <Button variant="contained">Cart Page Me</Button>
        <ul>
          <li>
            <Link to={"/product/home-kit/1"}>Your Name</Link>
          </li>
          <li>
            <Link to={"/product/dog-food/2"}>Your Friend</Link>
          </li>
          <li>
            <Link to={"/product/ho/3"}>Your Friend</Link>
          </li>
        </ul>
      </PageMargin>

      <Outlet />
    </>
  );
}
