import { LoginProvider } from "./LoginProvider.jsx";
import { Box, Button, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Page1 } from "./Page1.jsx";
import "./App.css";
import Analysis from "./board/Analysis.jsx";
import React, { useState } from "react";
import { Login } from "./member/Login.jsx";
import styled from "@emotion/styled";
import axios from "axios";
import { Home } from "./home/Home.jsx";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import BoardList from "./board/BoardList.jsx";
import { Signup } from "./member/Signup.jsx";
import AddressForm from "./board/AddressForm.jsx";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MemberEdit from "./member/MemberEdit.jsx";
import AccountInfo from "./management/AccountInfo.jsx";
import CardInfo from "./management/CardInfo.jsx";

// axios interceptor 설정
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const chakraTheme = extendTheme({
  fonts: {
    body: "GmarketSansMedium, sans-serif",
    heading: "GmarketSansMedium, sans-serif",
  },
});

const lightTheme = {
  body: "#FFF",
  text: "#000",
};

const darkTheme = {
  body: "#112",
  text: "#cbcbcb",
};

const themes = {
  light: lightTheme,
  dark: darkTheme,
};

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.body};
  color: ${(props) => props.theme.text};
  min-height: 100vh;
`;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { index: true, element: <BoardList /> },
      { path: "page1", element: <Page1 /> },
      { path: "analysis", element: <Analysis /> },
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      { path: "member-edit", element: <MemberEdit /> },
      { path: "test", element: <AddressForm /> },
      { path: "account-info", element: <AccountInfo /> },
      { path: "card-info", element: <CardInfo /> },
    ],
  },
]);

function App() {
  const [themeMode, setThemeMode] = useState("light");

  const toggleTheme = () => {
    setThemeMode((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ChakraProvider theme={chakraTheme}>
      <EmotionThemeProvider theme={themes[themeMode]}>
        <Wrapper>
          <Button
            bgColor={"gray.100"}
            onClick={toggleTheme}
            w={50}
            m={3}
            p={4}
            fontSize={"1.5rem"}
          >
            {themeMode == "light" && <FontAwesomeIcon icon={faMoon} />}
            {themeMode != "light" && <FontAwesomeIcon icon={faSun} />}
          </Button>
          <LoginProvider>
            <RouterProvider router={router} />
          </LoginProvider>
        </Wrapper>
      </EmotionThemeProvider>
    </ChakraProvider>
  );
}

export default App;

export function myToast(toast, text, status) {
  toast({
    description: text,
    status: status,
    position: "top",
    duration: 3000,
    isClosable: true,
  });
}
