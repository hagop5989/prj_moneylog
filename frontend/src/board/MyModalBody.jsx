import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Image,
  Input,
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
  const [axiosState, setAxiosState] = useState(false);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();
  const [modalRows, setModalRows] = useState([]);
  const [modalInputRow, setModalInputRow] = useState({
    id: "",
    boardId: editRow.id,
    nickName: account.nickName,
    text: "",
    likeState: true,
    fileList: [],
  });

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
        setAxiosState(!axiosState);
      })
      .catch(() => {})
      .finally(() => {});
  }

  function handleDeleteByModalId(modalRowId) {
    axios
      .delete("/api/board/modal/delete", { data: { id: modalRowId } })
      .then((res) => {
        myToast(toast, "삭제완료 되었습니다.", "success");
        setAxiosState(!axiosState);
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
        setAxiosState(!axiosState);
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
  }, [axiosState]);

  const handleImageClick = (src) => {
    window.open(src, "_blank");
  };
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
          <Th textAlign={"center"} w={"10%"}>
            #
          </Th>
          <Th textAlign={"center"} w={"20%"}>
            작성자
          </Th>
          <Th textAlign={"center"} w={"50%"}>
            의견
          </Th>
          <Th textAlign={"center"} w={"10%"} fontSize={"1rem"}>
            <FontAwesomeIcon icon={faThumbsUp} />
          </Th>
          <Th textAlign={"center"} w={"10%"}>
            입력
          </Th>
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
                <Button m={2} onClick={() => handleLikeToggle(row.id)}>
                  {row.likeState === true && (
                    <FontAwesomeIcon color={"blue"} icon={faThumbsUp} />
                  )}
                  {row.likeState === false && (
                    <FontAwesomeIcon color={"red"} icon={faThumbsDown} />
                  )}
                </Button>
              </Td>
              <Td>
                {row.fileList &&
                  row.fileList.map((file) => (
                    <Card m={3} key={file.name}>
                      <CardBody w={200}>
                        <Image
                          cursor="pointer"
                          onClick={() => handleImageClick(file.src)}
                          w={"100%"}
                          h={"100%"}
                          src={file.src}
                        />
                      </CardBody>
                    </Card>
                  ))}
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
            multiple
            type={"file"}
            onChange={(e) => {
              setFiles(e.target.files);
            }}
          ></Input>
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
