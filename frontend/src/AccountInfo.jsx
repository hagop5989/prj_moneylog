import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Heading,
  Image,
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

function AccountInfo(props) {
  const { isOpen, onOpen, onClose: originalOnClose } = useDisclosure();
  const [reload, setReload] = useState(false);
  const paymentDayList = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
  const [input, setInput] = useState({ cardPaymentDay: "1" });
  const [accountList, setAccountList] = useState([]);
  const [deleteList, setDeleteList] = useState([]);
  const [editAccount, setEditAccount] = useState();
  const [editing, setEditing] = useState(false);
  const [image, setImage] = useState();
  const [previewImage, setPreviewImage] = useState();
  const toast = useToast();

  const handleInputChange = (field) => (e) => {
    if (!editing) {
      setInput((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    } else if (editing) {
      setEditAccount((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    }
  };

  const resetModalState = () => {
    setEditAccount(null);
    setEditing(false);
    setInput({ cardPaymentDay: "1" });
    setImage(null);
    setPreviewImage(null);
  };

  const onClose = () => {
    resetModalState();
    originalOnClose();
  };

  function closeAndLoad() {
    onClose();
    setReload(!reload);
  }

  function closeEdit() {
    resetModalState();
    closeAndLoad();
  }

  function handleInputSubmit() {
    if (!editing) {
      axios
        .postForm("api/account", { ...input, files: image })
        .then(() => {
          myToast(toast, "저장 되었습니다", "success");
          closeAndLoad();
        })
        .catch()
        .finally();
    } else if (editing) {
      axios.put("/api/account", { ...editAccount }).then(() => {
        myToast(toast, "수정 되었습니다", "success");
        closeEdit();
      });
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // files 이지만 1개만 쓰려함.
    setImage(files[0]);
    if (files.length > 0) {
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setPreviewImage(null);
    }
    console.log(files);
    console.log(image);
  };

  useEffect(() => {
    axios.get("/api/account").then((res) => {
      setAccountList(res.data);
    });
  }, [reload]);

  const handleDeleteListChange = (e) => {
    if (e.target.checked) {
      setDeleteList((prev) => [...prev, e.target.value]);
    } else {
      setDeleteList(deleteList.filter((item) => item !== e.target.value));
    }
    console.log({ deleteList: deleteList });
  };

  function handleDeleteSubmit() {
    axios
      .post("/api/account/delete", deleteList)
      .then(() => {
        myToast(toast, "삭제 되었습니다.", "success");
        setReload(!reload);
      })
      .catch(() => {
        myToast(toast, "삭제 오류.", "error");
      });
  }

  function handleCardEdit(cardId) {
    setEditing(true);
    axios.get("/api/account/select", { params: { cardId } }).then((res) => {
      setEditAccount(res.data);
    });
    onOpen();
  }

  return (
    <Box>
      <Heading>통장 관리</Heading>
      <Button colorScheme={"teal"} onClick={onOpen}>
        입력
      </Button>
      <Button colorScheme={"red"} onClick={handleDeleteSubmit}>
        삭제
      </Button>
      <Table>
        <Thead>
          <Tr bgColor={"gray.100"}>
            <Td>선택</Td>
            <Td>로고</Td>
            <Td>은행</Td>
            <Td>통장이름</Td>
            <Td>잔액</Td>
            <Td>기타</Td>
          </Tr>
        </Thead>
        <Tbody>
          {accountList.map((card) => (
            <Tr key={card.id} onClick={() => handleCardEdit(card.id)}>
              <Td>
                <Checkbox
                  value={card.id}
                  ml={1}
                  onChange={(e) => handleDeleteListChange(e)}
                />
              </Td>
              <Td>
                <Image w={"50px"} src={"/public/CGV.gif"}></Image>
              </Td>
              <Td>{card.bank}</Td>
              <Td>{card.cardName}</Td>
              <Td>{card.cardLimit.toLocaleString()} 원</Td>
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
              통장 입력 및 수정
              <ModalCloseButton />
            </ModalHeader>
            <ModalBody>
              <Flex flexDirection={"column"} gap={"10px"}>
                은행
                <Input
                  value={editAccount ? editAccount.bank : ""}
                  onChange={handleInputChange("bank")}
                />
                로고(필수아님)
                <Input
                  type={"file"}
                  lineHeight={"30px"}
                  onChange={(e) => handleFileChange(e)}
                />
                {previewImage && (
                  <Box w={"100px"} h={"100px"}>
                    미리보기
                    <Image
                      w={"100%"}
                      src={previewImage || ""}
                      objectFit={"contain"}
                    />
                  </Box>
                )}
                통장이름
                <Input
                  value={editAccount ? editAccount.cardName : ""}
                  onChange={handleInputChange("cardName")}
                />
                잔액
                <Input
                  type="number"
                  value={editAccount ? editAccount.cardLimit : ""}
                  onChange={handleInputChange("cardLimit")}
                />
                기타정보
                <Input
                  value={editAccount ? editAccount.etcInfo : ""}
                  onChange={handleInputChange("etcInfo")}
                />
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme={"teal"} onClick={handleInputSubmit}>
                {editing ? "수정" : "저장"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Box>
  );
}

export default AccountInfo;
