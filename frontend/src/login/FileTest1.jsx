import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  Image,
  Input,
  Table,
  Td,
} from "@chakra-ui/react";
import axios from "axios";

function FileTest1(props) {
  const [files, setFiles] = useState([]);
  const [fileList, setFileList] = useState([]);
  // file 목록 작성
  const fileNameList = [];
  for (let i = 0; i < files.length; i++) {
    fileNameList.push(<li>{files[i].name}</li>);
  }

  function handleSubmitFile() {
    axios.postForm();
  }

  return (
    <Box>
      <Input
        multiple
        type={"file"}
        onChange={(e) => {
          setFiles(e.target.files);
        }}
      />
      <Table>
        <Td>
          {fileList &&
            fileList.map((file) => (
              <Card m={3} key={file.name}>
                <CardBody w={200}>
                  <Image
                    cursor="pointer"
                    // onClick={() => handleImageClick(file.src)}
                    w={"100%"}
                    h={"100%"}
                    src={file.src}
                  />
                </CardBody>
              </Card>
            ))}
        </Td>
      </Table>
      <Button onClick={handleSubmitFile}>제출</Button>
    </Box>
  );
}

export default FileTest1;
