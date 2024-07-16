import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalContent,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../LoginProvider.jsx";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { myToast } from "../App.jsx";
import { MyModalBody } from "./MyModalBody.jsx";
import axios from "axios";

function BoardList(props) {
  const account = useContext(LoginContext);
  const navigate = useNavigate();

  const [inputRow, setInputRow] = useState({
    date: "",
    income: 0,
    expense: 0,
    how: "",
    categories: [],
    rowSum: 0,
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
      categories: clickedList,
      rowSum: inputRow.income - inputRow.expense,
    };
    axios
      .post("/api/board/addRow", newRow)
      .then((res) => {
        fetchBoardList();
        toast({
          description: "입력 완료 되었습니다!",
          status: "success",
          position: "top",
        });
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

  const handleRowUpdate = (row) => {
    const updatedRow = { ...row };
    axios
      .put("/api/board/updateRow", updatedRow)
      .then(() => {
        fetchBoardList();
        toast({
          description: "수정 완료 되었습니다!",
          status: "info",
          position: "top",
        });
      })
      .catch((e) => console.error(e));
  };

  const handleRowDelete = (row) => {
    axios
      .delete("/api/board/deleteRow", {
        params: { rowId: row.id },
      })
      .then(() => {
        fetchBoardList();
        toast({
          description: "삭제 완료 되었습니다!",
          status: "error",
          position: "top",
        });
      })
      .catch((e) => console.error(e));
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

  const MiniBox = ({ text, clickedList, handleMiniBoxChange }) => {
    const isSelected = clickedList.includes(text);

    return (
      <Box
        aria-valuetext={text}
        onClick={() => handleMiniBoxChange(text)}
        bgColor={isSelected ? "blue.100 " : ""}
        boxSize={"50px"}
        border={"2px solid gray"}
        borderRadius={"5px"}
        textAlign="center"
        lineHeight={"50px"}
        cursor={"pointer"}
        margin={"2px"}
      >
        {text}
      </Box>
    );
  };

  const MiniBoxGroup = ({ items, clickedList, handleMiniBoxChange }) => {
    return (
      <Flex>
        {items.map((item) => (
          <MiniBox
            key={item}
            text={item}
            clickedList={clickedList}
            handleMiniBoxChange={handleMiniBoxChange}
          />
        ))}
      </Flex>
    );
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
                handleRowUpdate={handleRowUpdate}
                handleRowDelete={handleRowDelete}
                MiniBoxGroup={MiniBoxGroup}
              />
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

const Row = ({
  row,
  id,
  maxId,
  handleRowUpdate,
  handleRowDelete,
  MiniBoxGroup,
}) => {
  const [editRow, setEditRow] = useState({ ...row });
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleEditChange = (field, value) => {
    setEditRow((prevRow) => ({
      ...prevRow,
      [field]: value,
    }));
  };

  const handleIncomeChange = (event) => {
    const value = parseFloat(event.target.value.replace(/,/g, "")) || 0;
    handleEditChange("income", value);
  };

  const handleExpenseChange = (event) => {
    const value = parseFloat(event.target.value.replace(/,/g, "")) || 0;
    handleEditChange("expense", value);
  };

  const handleCategoryChange = (text) => {
    setEditRow((prevRow) => {
      const newCategories = prevRow.categories.includes(text)
        ? prevRow.categories.filter((category) => category !== text)
        : [...prevRow.categories, text];
      return {
        ...prevRow,
        categories: newCategories,
      };
    });
  };

  return (
    <Tr
      bgColor={row.id === maxId ? "rgba(70,50,17,0.06)" : ""}
      _hover={{ bgColor: "gray.50 " }}
    >
      <Td fontSize={"1.3rem"}>
        <FontAwesomeIcon
          icon={faComments}
          cursor={"pointer"}
          onClick={onOpen}
        />
      </Td>
      <Td>
        <Input
          type={"date"}
          value={editRow.date}
          onChange={(e) => handleEditChange("date", e.target.value)}
        />
      </Td>
      <Td>
        <InputGroup>
          <InputLeftAddon color="blue" children="+" />
          <Input
            type={"text"}
            width={"150px"}
            color={"blue"}
            value={editRow.income.toLocaleString()}
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
            color={"red"}
            value={editRow.expense.toLocaleString()}
            onChange={handleExpenseChange}
          />
        </InputGroup>
      </Td>
      <Td>{Number(editRow.income - editRow.expense).toLocaleString()}</Td>
      <Td>
        <MiniBoxGroup
          items={["수입", "식비", "교통", "주거", "생활", "여가"]}
          clickedList={editRow.categories}
          handleMiniBoxChange={handleCategoryChange}
        />
      </Td>
      <Td>
        <Textarea
          value={editRow.how}
          onChange={(e) => handleEditChange("how", e.target.value)}
        />
      </Td>
      <Td>
        <Flex direction={"column"}>
          <Button
            colorScheme={"blue"}
            m={"3px"}
            onClick={() => handleRowUpdate(editRow)}
          >
            수정
          </Button>
          <Button
            colorScheme={"red"}
            m={"3px"}
            onClick={() => handleRowDelete(row)}
          >
            삭제
          </Button>
          <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent minW={"65%"} maxHeight="100%">
              <MyModalBody editRow={editRow} />
            </ModalContent>
          </Modal>
        </Flex>
      </Td>
    </Tr>
  );
};

export default BoardList;
