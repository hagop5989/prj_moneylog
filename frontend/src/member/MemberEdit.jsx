import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { myToast } from "../App.jsx";

function MemberEdit(props) {
  const [newMember, setNewMember] = useState({
    nickName: "",
    password: "",
    email: "",
  });
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickNameCheck, setNickNameCheck] = useState(false);
  const isCheckedPassword = newMember.password === passwordCheck;
  const handlePwdClick = () => setPwdShow(!pwdShow);
  const navigate = useNavigate();
  const [pwdShow, setPwdShow] = useState(false);
  let toast = useToast();
  function handleSetMember(field, e) {
    setNewMember((member) => ({
      ...member,
      [field]: e.target.value.trim(),
    }));
  }

  function handleEditNickNameCheck() {
    axios
      .get(`/api/member/signupCheck?nickName=${newMember.nickName}`)
      .then(() => {
        myToast(toast, "변경 가능합니다.", "info");
        setNickNameCheck(true);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          myToast(err.response.data.nickName, "error");
          setNickNameCheck(false);
        }
      })
      .finally(() => {});
  }

  function handleEdit() {
    axios
      .put("/api/member/update", newMember)
      .then(() => {
        myToast(toast, "수정 완료되었습니다.", "success");
        navigate("/");
      })
      .catch((e) => {
        if (e.response.status === 400) {
          if (e.response.data.password) {
            myToast(toast, e.response.data.password, "error");
          } else {
            myToast(toast, "입력 값을 다시 확인해주세요", "error");
          }
        }
      })
      .finally(() => {
        // setEmailCheck(false);
        setNickNameCheck(false);
      });
  }

  useEffect(() => {
    axios.get("api/member/update").then((res) => {
      setNewMember(res.data);
      myToast(toast, "로드완료", "info");
    });
  }, []);

  const buttonStyle = () => ({
    bgColor: "blue.400",
    color: "white",
    fontWeight: "medium",
  });

  return (
    <Box>
      <Heading>정보수정</Heading>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"50%"}>
          <FormControl>
            <Flex my={3}>
              <FormLabel>이메일 :</FormLabel>
              <Text fontSize={"lg"}>{newMember.email}</Text>
            </Flex>
            <FormLabel>이름(닉네임)</FormLabel>
            <InputGroup>
              <Input
                placeholder={"한글 사용, 최소 2자, 최대 5자 가능합니다."}
                value={newMember.nickName}
                onChange={(e) => {
                  handleSetMember("nickName", e);
                  setNickNameCheck(false);
                }}
              />
              <InputRightElement w={75} mr={1}>
                <Button
                  onClick={handleEditNickNameCheck}
                  {...buttonStyle()}
                  isDisabled={nickNameCheck}
                >
                  중복확인
                </Button>
              </InputRightElement>
              <FormErrorMessage></FormErrorMessage>
            </InputGroup>
            비밀번호
            <InputGroup>
              <Input
                type={pwdShow ? "text" : "password"}
                defaultValue={""}
                onChange={(e) => handleSetMember("password", e)}
              />
              <InputRightElement mr={2}>
                <Button h="1.75rem" size="sm" onClick={handlePwdClick}>
                  {pwdShow ? (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormHelperText fontSize={"12px"}>
              8자 ~16자 이하 1개이상 영문자, 숫자, 특수문자 포함
            </FormHelperText>
            비밀번호 확인
            <Input
              type={pwdShow ? "text" : "password"}
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
            {!isCheckedPassword && (
              <FormHelperText>비밀번호 일치여부를 확인해주세요.</FormHelperText>
            )}
            <Flex justifyContent="center">
              <Button
                // isDisabled={!emailCheck || !nickNameCheck || !passwordCheck}
                onClick={handleEdit}
                colorScheme={"purple"}
                w={120}
                my={3}
              >
                정보수정
              </Button>
            </Flex>
          </FormControl>
        </Center>
      </Flex>
    </Box>
  );
}

export default MemberEdit;
