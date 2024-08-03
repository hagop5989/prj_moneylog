import {
  Box,
  Button,
  Card,
  CardBody,
  CloseButton,
  Flex,
  Image,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../LoginProvider.jsx";
import { myToast } from "../App.jsx";
import {
  faCreditCard,
  faSackDollar,
  faTrashCan,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import MiniBox from "./Minibox.jsx";

export function MyModalBody({ editRow }) {
  const account = useContext(LoginContext);
  const [reload, setReload] = useState(false);
  const toast = useToast();

  const [accountList, setAccountList] = useState([]);
  const [cardList, setCardList] = useState([]);
  const [files, setFiles] = useState([]);
  const [dbAccountList, setDbAccountList] = useState([]);
  const [dbCardList, setDbCardList] = useState([]);
  const [modalRows, setModalRows] = useState([]);
  const [modalInputRow, setModalInputRow] = useState({
    modalId: "",
    boardId: editRow.id,
    nickName: account.nickName,
    text: "",
    likeState: true,
    fileList: [],
  });
  const [showAddFileBtn, setShowAddFileBtn] = useState({});

  // file 목록 작성
  const fileNameList = [];
  for (let i = 0; i < files.length; i++) {
    fileNameList.push(<li>{files[i].name}</li>);
  }

  const handleRowChange = (rowId, field, value) => {
    const updatedRows = modalRows.map((row) =>
      row.id === rowId ? { ...row, [field]: value } : row,
    );
    setModalRows(updatedRows);
  };

  const handleLikeToggle = (rowId) => {
    const updatedRows = modalRows.map((row) =>
      row.id === rowId ? { ...row, likeState: !row.likeState } : row,
    );
    setModalRows(updatedRows);
  };

  const handleInputChange = (field, value) => {
    setModalInputRow((prevRow) => ({
      ...prevRow,
      [field]: value,
    }));
  };

  function handleModalInsert() {
    const boardId = modalInputRow.boardId;
    const nickName = modalInputRow.nickName;
    const text = modalInputRow.text;
    const likeState = modalInputRow.likeState;

    axios
      .postForm("/api/board/modal/insert", {
        boardId,
        nickName,
        text,
        likeState,
        files,
      })
      .then((res) => {
        myToast(toast, "입력완료 되었습니다.", "success");
        setReload(!reload);
        setModalInputRow({
          id: "",
          boardId: editRow.id,
          nickName: account.nickName,
          text: "",
          likeState: true,
          fileList: [],
        });
        setFiles([]);
        document.getElementById("file-input").value = null; // 파일 입력 초기화
      })
      .catch(() => {})
      .finally(() => {});
  }

  const handleModalAccountChange = (bank, rowId) => {
    setModalRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === rowId) {
          const newAccountList = row.accountList.includes(bank)
            ? row.accountList.filter((item) => item !== bank)
            : [...row.accountList, bank];
          return { ...row, accountList: newAccountList };
        }
        return row;
      }),
    );
  };

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

  function handleCardListChange(bank, rowId) {
    setModalRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === rowId) {
          const newCardList = row.cardList.includes(bank)
            ? row.cardList.filter((item) => item !== bank)
            : [...row.cardList, bank];
          return { ...row, cardList: newCardList };
        }
        return row;
      }),
    );
  }

  function handleDeleteByModalId(modalRowId) {
    axios
      .delete("/api/board/modal/delete", { data: { id: modalRowId } })
      .then((res) => {
        myToast(toast, "삭제완료 되었습니다.", "success");
        setReload(!reload);
      })
      .catch(() => {})
      .finally(() => {});
  }

  function handleUpdateModal(row) {
    const updateRow = { ...row };
    axios
      .put("/api/board/modal/update", updateRow)
      .then((res) => {
        myToast(toast, "수정완료 되었습니다.", "success");
        setReload(!reload);
      })
      .catch(() => {})
      .finally(() => {});
  }

  useEffect(() => {
    console.log("accountList changed:", accountList);
  }, [accountList]);

  useEffect(() => {
    console.log("cardList changed:", cardList);
  }, [cardList]);

  useEffect(() => {
    axios
      .get(`/api/board/modal/list?boardId=${editRow.id}`)
      .then((res) => {
        const modalListWithLists = res.data.modalList.map((row) => ({
          ...row,
          accountList: [],
          cardList: [],
        }));
        setModalRows(modalListWithLists);
        setDbAccountList(res.data.accountList);
        setDbCardList(res.data.cardList);
      })
      .catch(() => {})
      .finally(() => {});
  }, [reload]);

  const handleImageClick = (src) => {
    window.open(src, "_blank", "noopener,noreferrer");
  };

  function handleDeleteImage(rowId, fileName) {
    axios
      .delete("/api/board/modal/delete-img", {
        params: { id: rowId, fileName },
      })
      .then((res) => {
        myToast(toast, "삭제 완료되었습니다", "success");
        setReload(!reload);
      })
      .catch((err) => {
        myToast(toast, "삭제 실패", "error");
      });
  }

  function handleAddFileBtn(rowId) {
    setShowAddFileBtn((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  }

  function handleInsertFile(e, rowId) {
    axios
      .postForm("/api/board/modal/insert-file", {
        modalId: rowId,
        files: e.target.files,
      })
      .then(() => {
        myToast(toast, "추가 완료", "success");
        setReload(!reload);
        handleAddFileBtn(rowId);
      })
      .catch(() => {
        myToast(toast, "추가 실패", "error");
      });
  }

  return (
    <>
      <ModalHeader>{editRow.date} 댓글 </ModalHeader>
      <ModalBody>
        <Box mb={1}>
          [수입 : {editRow.income.toLocaleString()} 지출 :{" "}
          {editRow.expense.toLocaleString()} 합계 :{" "}
          {(editRow.income - editRow.expense).toLocaleString()} ]
        </Box>
        <Table>
          <Thead>
            <Tr>
              <Th width="5%">#</Th>
              <Th width="15%">작성자</Th>
              <Th width="30%">의견</Th>
              <Th width="30%">카드/계좌</Th>
              <Th width="10%">
                <FontAwesomeIcon icon={faThumbsUp} />
              </Th>
              <Th width="30%">사진</Th>
              <Th width="10%">입력</Th>
            </Tr>
          </Thead>
          <Tbody>
            {modalRows.map((row) => (
              <Tr key={row.id}>
                <Td>{row.id}</Td>
                <Td
                  onChange={(e) =>
                    handleRowChange(row.id, "nickName", e.target.value)
                  }
                >
                  {row.nickName}
                </Td>
                <Td>
                  <Textarea
                    w={280}
                    value={row.text}
                    onChange={(e) =>
                      handleRowChange(row.id, "text", e.target.value)
                    }
                  />
                </Td>
                <Td>
                  <Flex alignItems="center">
                    <Box w={"20px"} fontSize={"xl"} mr={2}>
                      <FontAwesomeIcon icon={faSackDollar} />
                    </Box>
                    {dbAccountList.map((account) => (
                      <Tooltip
                        key={account.id}
                        label={`
                        은행: ${account.bank},
                        계좌명: ${account.accountName},
                        계좌번호: ${formatAccountNumber(account.accountNumber)},
                        잔액: ${Number(account.accountMoney).toLocaleString()},
                        기타: ${account.etcInfo}
                      `}
                        aria-label="카드 정보"
                      >
                        <Box>
                          <MiniBox
                            border={"1px solid red"}
                            key={account.id}
                            text={account.bank.slice(0, 2)}
                            clickedList={row.accountList}
                            handleMiniBoxChange={() =>
                              handleModalAccountChange(
                                account.bank.slice(0, 2),
                                row.id,
                              )
                            }
                          />
                        </Box>
                      </Tooltip>
                    ))}
                  </Flex>
                  <Flex alignItems="center" w={"100%"}>
                    <Box w={"20px"} fontSize={"xl"} mr={2}>
                      <FontAwesomeIcon icon={faCreditCard} />
                    </Box>
                    {dbCardList.map((card) => (
                      <Tooltip
                        key={card.id}
                        label={`
                      은행: ${card.bank},
                      카드명: ${card.cardName},
                      카드한도: ${card.cardLimit},
                      결제일: ${card.cardPaymentDay},
                      기타: ${card.etcInfo}
                    `}
                        aria-label="카드 정보"
                      >
                        <Box>
                          <MiniBox
                            key={card.id}
                            text={card.bank.slice(0, 2)}
                            clickedList={row.cardList}
                            handleMiniBoxChange={() =>
                              handleCardListChange(
                                card.bank.slice(0, 2),
                                row.id,
                              )
                            }
                          />
                        </Box>
                      </Tooltip>
                    ))}
                  </Flex>
                </Td>
                <Td>
                  <Button mx={2} onClick={() => handleLikeToggle(row.id)}>
                    {row.likeState === true && (
                      <FontAwesomeIcon color={"blue"} icon={faThumbsUp} />
                    )}
                    {row.likeState === false && (
                      <FontAwesomeIcon color={"red"} icon={faThumbsDown} />
                    )}
                  </Button>
                </Td>
                <Td maxH="200px" overflow="auto" verticalAlign="top">
                  {row.fileList &&
                    row.fileList.map((file) => (
                      <Card key={file.name} m={2} maxH="190px">
                        <CardBody
                          height="100%"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Image
                            cursor="pointer"
                            onClick={() => handleImageClick(file.src)}
                            maxW="100%"
                            maxH="100%"
                            objectFit={"contain"}
                            src={file.src}
                          />
                          <CloseButton
                            onClick={() => handleDeleteImage(row.id, file.name)}
                            position={"absolute"}
                            right={"20px"}
                            top={"10px"}
                          >
                            X
                          </CloseButton>
                        </CardBody>
                      </Card>
                    ))}
                  {row.fileList.length > 0 || (
                    <Box>
                      <Button
                        display={!showAddFileBtn[row.id] ? "block" : "none"}
                        colorScheme={"blue"}
                        onClick={() => handleAddFileBtn(row.id)}
                      >
                        사진추가
                      </Button>
                      <Input
                        display={showAddFileBtn[row.id] ? "block" : "none"}
                        type={"file"}
                        colorScheme={"blue"}
                        lineHeight={"25px"}
                        onChange={(e) => handleInsertFile(e, row.id)}
                      />
                    </Box>
                  )}
                </Td>
                {row.memberId === parseInt(account.id) && (
                  <Td>
                    <Flex
                      boxSize={"10%"}
                      gap={2}
                      fontWeight={"sm"}
                      flexDirection={"column"}
                    >
                      <Button
                        colorScheme={"teal"}
                        onClick={() => {
                          handleUpdateModal(row);
                        }}
                      >
                        <FontAwesomeIcon icon={faWrench} />
                      </Button>
                      <Button
                        colorScheme={"red"}
                        onClick={() => {
                          handleDeleteByModalId(row.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </Button>
                    </Flex>
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Box mt={2}>
          작성자 : {account.nickName}
          <Button
            m={2}
            onClick={() =>
              handleInputChange("likeState", !modalInputRow.likeState)
            }
          >
            {modalInputRow.likeState === true && (
              <FontAwesomeIcon color={"blue"} icon={faThumbsUp} />
            )}
            {modalInputRow.likeState === false && (
              <FontAwesomeIcon color={"red"} icon={faThumbsDown} />
            )}
          </Button>
          <Textarea
            value={modalInputRow.text}
            onChange={(e) => handleInputChange("text", e.target.value)}
          />
          <Input
            id="file-input"
            type={"file"}
            onChange={(e) => {
              setFiles(e.target.files);
            }}
          />
          <Button
            w={100}
            mt={2}
            onClick={handleModalInsert}
            colorScheme={"blue"}
          >
            저장
          </Button>
        </Box>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </>
  );
}
