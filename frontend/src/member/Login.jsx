import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../LoginProvider.jsx";
import axios from "axios";

export function Login() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const toast = useToast();

  function handleLogin() {
    axios
      .post("/api/member/token", loginMember)
      .then((res) => {
        account.login(res.data.token);
        mytoast("로그인 되었습니다", "success");
        navigate("/");
      })
      .catch((e) => {
        if (e.response.status === 403) {
          mytoast(`로그인 실패 !\n 입력 값을 확인 해주세요.`, "error");
        }
      })
      .finally(() => {});
  }

  function handleLoginMember(field, e) {
    setLoginMember((member) => ({
      ...member,
      [field]: e.target.value.trim(),
    }));
  }

  const [loginMember, setLoginMember] = useState({
    password: "",
    email: "",
  });

  function mytoast(text, status) {
    toast({
      description: <Box whiteSpace="pre-line">{text}</Box>,
      status: status,
      position: "top",
      duration: "700",
    });
  }

  return (
    <Box>
      <Heading>로그인</Heading>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"30%"}>
          <FormControl
            as="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <FormControl id="email">
              <FormLabel>이메일</FormLabel>
              <InputGroup>
                <Input
                  value={loginMember.email}
                  placeholder={"abc@abc.com"}
                  onChange={(e) => handleLoginMember("email", e)}
                />
              </InputGroup>
            </FormControl>

            <FormControl id="password">
              <FormLabel>비밀번호</FormLabel>
              <Input
                value={loginMember.password}
                type={"password"}
                onChange={(e) => handleLoginMember("password", e)}
                placeholder={
                  "8자 ~16자 이하, 1개 이상 영문자, 숫자, 특수문자 포함"
                }
              />
            </FormControl>

            <Flex justifyContent="center">
              <Button type="submit" colorScheme={"purple"} w={120} my={3}>
                로그인
              </Button>
            </Flex>
          </FormControl>
        </Center>
      </Flex>
    </Box>
  );
}
