import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Table,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../LoginProvider.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Row from "./Row.jsx";
import { myToast } from "../App.jsx";
import MiniBoxGroup from "./MiniBoxGroup.jsx";

function BoardList(props) {
  const account = useContext(LoginContext);
  const navigate = useNavigate();

  const [inputRow, setInputRow] = useState({
    date: "",
    income: 0,
    expense: 0,
    how: "",
    categories: [],
  });
  const [dbRows, setDbRows] = useState([]);
  const [clickedList, setClickedList] = useState([]);
  const toast = useToast();

  useEffect(() => {
    if (!account.isLoggedIn() && !localStorage.getItem("token")) {
      myToast(toast, "로그인 필요!!", "error");
      account.logout();
      navigate("/login");
    }
    fetchBoardList();
  }, [account.id]);

  const fetchBoardList = () => {
    axios
      .get("/api/board/list")
      .then((res) => {
        setDbRows(
          res.data.boardList.map((board) => ({
            ...board,
            income: Number(board.income),
            expense: Number(board.expense),
          })),
        );
      })
      .catch((e) => console.error("Error fetching board list:", e));
  };

  const handleRowAdd = () => {
    const newRow = {
      ...inputRow,
      memberId: account.id,
      categories: clickedList,
      rowSum: inputRow.income - inputRow.expense,
    };
    axios
      .post("/api/board/addRow", newRow)
      .then((res) => {
        fetchBoardList();
        myToast(toast, "입력완료 되었습니다", "success");
      })
      .catch((e) => console.error({ e }))
      .finally(() => {
        setInputRow({
          date: "",
          income: 0,
          expense: 0,
          how: "",
          categories: [],
        });
        setClickedList([]);
      });
  };

  const handleInputChange = (field, value) => {
    setInputRow((prevRow) => ({
      ...prevRow,
      [field]: value,
    }));
  };

  const handleIncomeChange = (event) => {
    const value = parseFloat(event.target.value.replace(/,/g, "")) || 0;
    handleInputChange("income", value);
  };

  const handleExpenseChange = (event) => {
    const value = parseFloat(event.target.value.replace(/,/g, "")) || 0;
    handleInputChange("expense", value);
  };

  const handleMiniBoxChange = (text) => {
    setClickedList((prevList) => {
      if (prevList.includes(text)) {
        return prevList.filter((item) => item !== text);
      } else {
        return [...prevList, text];
      }
    });
  };

  const maxId =
    dbRows.length > 0 ? Math.max(...dbRows.map((row) => row.id)) : 0;

  return (
    <Box>
      <Box>
        <Table>
          <Thead>
            <Tr bgColor={"gray.50"}>
              <Th textAlign={"center"} fontSize={"1rem"}>
                댓글
              </Th>
              <Th textAlign={"center"} fontSize={"1rem"}>
                날짜
              </Th>
              <Th textAlign={"center"} fontSize={"1rem"}>
                수입
              </Th>
              <Th textAlign={"center"} fontSize={"1rem"}>
                지출
              </Th>
              <Th textAlign={"center"} fontSize={"1rem"}>
                합계
              </Th>
              <Th textAlign={"center"} fontSize={"1rem"}>
                카테고리
              </Th>
              <Th textAlign={"center"} fontSize={"1rem"}>
                방법
              </Th>
              <Th textAlign={"center"} fontSize={"1rem"}>
                입력
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr border="2.5px solid gray">
              <Td>입력</Td>
              <Td>
                <Input
                  type={"date"}
                  value={inputRow.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                />
              </Td>
              <Td>
                <InputGroup>
                  <InputLeftAddon color="blue" children="+" />
                  <Input
                    type={"text"}
                    width={"150px"}
                    value={inputRow.income.toLocaleString()}
                    color={"blue"}
                    onChange={handleIncomeChange}
                  />
                </InputGroup>
              </Td>
              <Td>
                <InputGroup>
                  <InputLeftAddon color={"red"} children="-" />
                  <Input
                    type={"text"}
                    width={"150px"}
                    value={inputRow.expense.toLocaleString()}
                    color={"red"}
                    onChange={handleExpenseChange}
                  />
                </InputGroup>
              </Td>
              <Td>{(inputRow.income - inputRow.expense).toLocaleString()}</Td>
              <Td>
                <MiniBoxGroup
                  items={["수입", "식비", "교통", "주거", "생활", "여가"]}
                  clickedList={clickedList}
                  handleMiniBoxChange={handleMiniBoxChange}
                />
              </Td>
              <Td>
                <Textarea
                  placeholder={"설명을 입력해 주세요 !"}
                  value={inputRow.how}
                  onChange={(e) => handleInputChange("how", e.target.value)}
                />
              </Td>
              <Td>
                <Flex direction={"column"}>
                  <Button colorScheme={"blue"} m={"3px"} onClick={handleRowAdd}>
                    입력
                  </Button>
                </Flex>
              </Td>
            </Tr>
            {dbRows.map((row) => (
              <Row
                key={row.id}
                id={row.id}
                row={row}
                maxId={maxId}
                fetchBoardList={fetchBoardList}
              />
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default BoardList;
