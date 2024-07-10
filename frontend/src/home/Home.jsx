import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar.jsx";

export function Home() {
  return (
    <Box mx={100} my={4}>
      {/*<Flex border={"2px solid gray"} borderRadius={"15px"}>*/}
      <Navbar />
      {/*</Flex>*/}
      <Box mt={5}>
        <Outlet />
      </Box>
    </Box>
  );
}
