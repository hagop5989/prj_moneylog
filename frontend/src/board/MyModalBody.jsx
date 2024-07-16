import {
  Box,
  Button,
  Card,
  CardBody,
  CloseButton,
  Flex,
  Image,
  Input,
  InputRightAddon,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Td,
  Textarea,
  Th,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../LoginProvider.jsx";
import { myToast } from "../App.jsx";

export function MyModalBody({ editRow }) {
  const account = useContext(LoginContext);
  const [reload, setReload] = useState(false);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();
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
  const [addFileRowId, setAddFileRowId] = useState(null);

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

  function handleUpdateModal(dbRow) {
    const updateRow = { ...dbRow };
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
    axios
      .get(`/api/board/modal/list?boardId=${editRow.id}`)
      .then((res) => {
        setModalRows(res.data);
        console.log(modalRows.fileList);
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

  /* todo: 개별파일 삭제 구현 */
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
        <Tr>
          <Th width="5%">#</Th>
          <Th width="15%">작성자</Th>
          <Th width="30%">의견</Th>
          <Th width="10%">
            <FontAwesomeIcon icon={faThumbsUp} />
          </Th>
          <Th width="30%">사진</Th>
          <Th width="10%">입력</Th>
        </Tr>
        <>
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
                  mt={-5}
                  w={280}
                  value={row.text}
                  onChange={(e) =>
                    handleRowChange(row.id, "text", e.target.value)
                  }
                />
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
                      colorScheme={"teal"}
                      onClick={() => handleAddFileBtn(row.id)}
                    >
                      사진추가
                    </Button>

                    <Input
                      display={showAddFileBtn[row.id] ? "block" : "none"}
                      type={"file"}
                      colorScheme={"teal"}
                      lineHeight={"25px"}
                      onChange={(e) => handleInsertFile(e, row.id)}
                    />
                  </Box>
                )}
              </Td>
              <Td>
                <Flex boxSize={"10%"} gap={2} fontWeight={"sm"}>
                  <Button
                    colorScheme={"blue"}
                    onClick={() => {
                      handleUpdateModal(row);
                    }}
                  >
                    수정
                  </Button>
                  <Button
                    colorScheme={"red"}
                    onClick={() => {
                      handleDeleteByModalId(row.id);
                    }}
                  >
                    삭제
                  </Button>
                </Flex>
              </Td>
            </Tr>
          ))}
        </>
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
            // multiple
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
