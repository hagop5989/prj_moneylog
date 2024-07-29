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

function CardInfo(props) {
  const { isOpen, onOpen, onClose: originalOnClose } = useDisclosure();
  const [reload, setReload] = useState(false);
  const paymentDayList = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
  const [input, setInput] = useState({ cardPaymentDay: "1" });
  const [cardList, setCardList] = useState([]);
  const [editCard, setEditCard] = useState();
  const [image, setImage] = useState();
  const [deleteList, setDeleteList] = useState([]);
  const [previewImage, setPreviewImage] = useState();
  const [editing, setEditing] = useState(false);
  const toast = useToast();

  const handleInputChange = (field) => (e) => {
    if (!editing) {
      setInput((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    } else if (editing) {
      setEditCard((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    }
  };

  const resetModalState = () => {
    setEditCard(null);
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
        .postForm("api/card", { ...input, files: image })
        .then(() => {
          myToast(toast, "저장 되었습니다", "success");
          closeAndLoad();
        })
        .catch()
        .finally();
    } else if (editing) {
      axios.put("/api/card", { ...editCard }).then(() => {
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
    axios.get("/api/card").then((res) => {
      setCardList(res.data);
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
      .post("/api/card/delete", deleteList)
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
    axios.get("/api/card/select", { params: { cardId } }).then((res) => {
      setEditCard(res.data);
    });
    onOpen();
  }

  return (
    <Box>
      <Heading>카드 관리</Heading>
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
            <Td>카드이름</Td>
            <Td>카드한도</Td>
            <Td>결제일</Td>
            <Td>기타</Td>
          </Tr>
        </Thead>
        <Tbody>
          {cardList.map((card) => (
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
                <Input
                  value={editCard ? editCard.bank : ""}
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
                카드이름
                <Input
                  value={editCard ? editCard.cardName : ""}
                  onChange={handleInputChange("cardName")}
                />
                한도
                <Input
                  type="number"
                  value={editCard ? editCard.cardLimit : ""}
                  onChange={handleInputChange("cardLimit")}
                />
                결제일
                <Select
                  value={editCard ? editCard.cardPaymentDay : ""}
                  onChange={handleInputChange("cardPaymentDay")}
                >
                  {paymentDayList.map((item, index) => (
                    <option key={index} value={item}>
                      {item}일
                    </option>
                  ))}
                </Select>
                기타정보
                <Input
                  value={editCard ? editCard.etcInfo : ""}
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

export default CardInfo;
