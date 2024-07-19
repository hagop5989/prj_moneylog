import React, { useContext, useState } from "react";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalContent,
  ModalOverlay,
  Td,
  Textarea,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../LoginProvider.jsx";
import axios from "axios";
import MiniBoxGroup from "./MiniBoxGroup.jsx";
import { MyModalBody } from "./MyModalBody.jsx";

const Row = ({ row, maxId, fetchBoardList }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editRow, setEditRow] = useState({ ...row });
  const account = useContext(LoginContext);
  const toast = useToast();

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

  const handleRowUpdate = () => {
    const updatedRow = { ...editRow };
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

  const handleRowDelete = () => {
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

  return (
    <Tr
      // bgColor={row.id === maxId ? "rgba(70,50,17,0.06)" : ""}
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
        {editRow.memberId === parseInt(account.id) && (
          <Flex direction={"column"}>
            <Button colorScheme={"blue"} m={"3px"} onClick={handleRowUpdate}>
              수정
            </Button>
            <Button colorScheme={"red"} m={"3px"} onClick={handleRowDelete}>
              삭제
            </Button>
          </Flex>
        )}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent minW={"65%"} maxHeight="100%">
            <MyModalBody editRow={editRow} />
          </ModalContent>
        </Modal>
      </Td>
    </Tr>
  );
};

export default Row;
