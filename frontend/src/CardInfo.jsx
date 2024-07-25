import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  Tbody,
  Td,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { myToast } from "./App.jsx";

function CardInfo(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reload, setReload] = useState(false);
  const paymentDayList = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
  const [input, setInput] = useState({ cardPaymentDay: "1" });
  const [cardList, setCardList] = useState([]);
  const toast = useToast();
  const handleInputChange = (field) => (e) => {
    setInput((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  function handleInputSubmit() {
    console.log("clicked!");
    axios
      .post("api/card", input)
      .then(() => {
        myToast(toast, "저장 되었습니다", "success");
        onClose();
        setReload(!reload);
      })
      .catch()
      .finally();
  }

  useEffect(() => {
    axios.get("/api/card").then((res) => {
      setCardList(res.data);
    });
  }, [reload]);

  return (
    <Box>
      <Heading>card Info</Heading>
      <Button colorScheme={"teal"} onClick={onOpen}>
        입력
      </Button>
      <Button colorScheme={"red"}>삭제</Button>
      <Table>
        <Thead>
          <Tr bgColor={"gray.100"}>
            <Td>선택</Td>
            <Td>로고</Td>
            <Td>은행</Td>
            <Td>카드이름</Td>
            <Td>카드한도</Td>
            <Td>결제일</Td>
            <Td>기타</Td>
          </Tr>
        </Thead>
        <Tbody>
          {cardList.map((card) => (
            <Tr key={card.id}>
              <Td>
                <Checkbox ml={10} mt={5} />
              </Td>
              <Td>로고</Td>
              <Td>{card.bank}</Td>
              <Td>{card.cardLimit}</Td>
              <Td>{card.cardName}</Td>
              <Td>{card.cardPaymentDay}일</Td>
              <Td>{card.etcInfo}</Td>
            </Tr>
          ))}
          <Tr>
            <Td></Td>
          </Tr>
        </Tbody>
      </Table>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              OOOO 카드
              <ModalCloseButton />
            </ModalHeader>
            <ModalBody>
              <Flex flexDirection={"column"} gap={"10px"}>
                은행
                <Input onChange={handleInputChange("bank")} />
                카드이름
                <Input onChange={handleInputChange("cardName")} />
                한도
                <Input onChange={handleInputChange("cardLimit")} />
                결제일
                <Select onChange={handleInputChange("cardPaymentDay")}>
                  {paymentDayList.map((item, index) => (
                    <option key={index} value={item}>
                      {item}일
                    </option>
                  ))}
                </Select>
                기타정보
                <Input onChange={handleInputChange("etcInfo")} />
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme={"teal"} onClick={handleInputSubmit}>
                저장
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Box>
  );
}

export default CardInfo;
