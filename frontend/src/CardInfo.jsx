import React from "react";
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
  Table,
  Tbody,
  Td,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { Label } from "recharts";

function CardInfo(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
          <Tr>
            <Checkbox ml={10} mt={5} />
            <Td>로고</Td>
            <Td>우리은행</Td>
            <Td>카드의 정석 V1</Td>
            <Td>100만원</Td>
            <Td>매달 1일</Td>
            <Td>기타정보</Td>
          </Tr>
          <Tr>
            <Checkbox ml={10} mt={5} />
            <Td>로고</Td>
            <Td>신한은행</Td>
            <Td>청년지원카드</Td>
            <Td>50만원</Td>
            <Td>매달 15일</Td>
            <Td>기타정보2</Td>
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
                <Input />
                카드이름
                <Input />
                한도
                <Input />
                결제일
                <Input />
                기타정보
                <Input />
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme={"teal"}>저장</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Box>
  );
}

export default CardInfo;
