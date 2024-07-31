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
import { myToast } from "../App.jsx";

function AccountInfo(props) {
  const { isOpen, onOpen, onClose: originalOnClose } = useDisclosure();
  const [reload, setReload] = useState(false);
  const [input, setInput] = useState({});
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
    setInput({});
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
        .post("api/account", { ...input })
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

  function handleAccountEdit(accountId) {
    setEditing(true);
    axios.get("/api/account/select", { params: { accountId } }).then((res) => {
      setEditAccount(res.data);
    });
    onOpen();
  }

  const formatAccountNumber = (value) => {
    if (!value) return value;
    const accountNumber = value.replace(/[^\d]/g, "");

    switch (accountNumber.length) {
      case 11:
        // 예: 00000000000 -> 000-00-00000
        return accountNumber.replace(/(\d{3})(\d{2})(\d{6})/, "$1-$2-$3");
      case 12:
        // 예: 000000000000 -> 000-000000-00
        return accountNumber.replace(/(\d{3})(\d{6})(\d{3})/, "$1-$2-$3");
      case 13:
        // 예: 0000000000000 -> 000-000000-000
        return accountNumber.replace(/(\d{3})(\d{6})(\d{4})/, "$1-$2-$3");
      case 14:
        // 예: 00000000000000 -> 000-0000-00000000
        return accountNumber.replace(/(\d{3})(\d{4})(\d{7})/, "$1-$2-$3");
      case 15:
        // 예: 000000000000000 -> 000-00-0000000000
        return accountNumber.replace(/(\d{3})(\d{2})(\d{10})/, "$1-$2-$3");
      default:
        // 기본 포맷 (4자리씩 끊기)
        return accountNumber.replace(/(\d{4})(?=\d)/g, "$1-");
    }
  };

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
            <Td>은행</Td>
            <Td>통장번호</Td>
            <Td>통장이름</Td>
            <Td>잔액</Td>
            <Td>기타</Td>
          </Tr>
        </Thead>
        <Tbody>
          {accountList.map((account) => (
            <Tr key={account.id} onClick={() => handleAccountEdit(account.id)}>
              <Td onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  value={account.id}
                  ml={1}
                  onChange={(e) => handleDeleteListChange(e)}
                />
              </Td>

              <Td>{account.bank}</Td>
              <Td>{formatAccountNumber(account.accountNumber)}</Td>
              <Td>{account.accountName}</Td>
              <Td>{Number(account.accountMoney).toLocaleString() || "0"} 원</Td>
              <Td>{account.etcInfo}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              {editAccount?.accountName} - 통장 입력 및 수정
              <ModalCloseButton />
            </ModalHeader>
            <ModalBody>
              <Flex flexDirection={"column"} gap={"10px"}>
                은행
                <Input
                  value={editAccount ? editAccount.bank : input.bank}
                  onChange={handleInputChange("bank")}
                />
                통장번호
                <Input
                  value={
                    editAccount
                      ? editAccount.accountNumber
                      : input.accountNumber
                  }
                  onChange={handleInputChange("accountNumber")}
                />
                통장이름
                <Input
                  value={
                    editAccount ? editAccount.accountName : input.accountName
                  }
                  onChange={handleInputChange("accountName")}
                />
                잔액
                <Input
                  type="number"
                  value={
                    editAccount ? editAccount.accountMoney : input.accountMoney
                  }
                  onChange={handleInputChange("accountMoney")}
                />
                기타정보
                <Input
                  value={editAccount ? editAccount.etcInfo : input.etcInfo}
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
