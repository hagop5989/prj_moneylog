import { Box, Flex, Heading, useToast } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import { useNavigate } from "react-router-dom";
import { myToast } from "./App.jsx";

const boxCss = () => ({
  textAlign: "center",
  fontSize: "3rem",
  margin: "30px",
  borderRadius: "md",
  border: "3px solid black",
  boxSize: "300px",
  lineHeight: "300px",
  _hover: { bgColor: "black", color: "white" },
});

export function Page1() {
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!account.isLoggedIn() && !localStorage.getItem("token")) {
      myToast(toast, "로그인 필요!!", "error");
      account.logout();
      navigate("/login");
    }
  }, [account.id]);

  return (
    <Flex height={"80vh"} alignItems="center" justifyContent={"center"}>
      <Box>
        <Heading>준비중입니다</Heading>
        <Box>
          <Flex>
            <Box
              {...boxCss()}
              cursor={"pointer"}
              onClick={() => navigate("/card-info")}
            >
              통장
            </Box>
            <Box
              {...boxCss()}
              cursor={"pointer"}
              onClick={() => navigate("/account-info")}
            >
              카드
            </Box>
          </Flex>
        </Box>
        <Box>page</Box>
      </Box>
    </Flex>
  );
}
