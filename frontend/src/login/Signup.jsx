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
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export function Signup() {
  const [newMember, setNewMember] = useState({
    nickName: "",
    password: "",
    email: "",
  });
  const [passwordCheck, setPasswordCheck] = useState("");
  const isCheckedPassword = newMember.password === passwordCheck;
  const [emailCheck, setEmailCheck] = useState(false);
  const [nickNameCheck, setNickNameCheck] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [pwdShow, setPwdShow] = useState(false);

  const handlePwdClick = () => setPwdShow(!pwdShow);
  // const handlePwdCheckClick = () => setPwdCheckShow(!pwdCheckShow);

  function mytoast(text, status) {
    toast({
      description: text,
      status: status,
      position: "top",
      duration: "700",
    });
  }

  function handleSignupEmailCheck() {
    axios
      .get(`/api/member/signupCheck?email=${newMember.email}`)
      .then(() => {
        mytoast("회원가입 가능합니다.", "info");
        setEmailCheck(true);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          mytoast(err.response.data.email, "error");
          setEmailCheck(false);
        }
      })
      .finally(() => {});
  }

  function handleSignupNickNameCheck() {
    axios
      .get(`/api/member/signupCheck?nickName=${newMember.nickName}`)
      .then(() => {
        mytoast("회원가입 가능합니다.", "info");
        setNickNameCheck(true);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          mytoast(err.response.data.nickName, "error");
          setNickNameCheck(false);
        }
      })
      .finally(() => {});
  }

  function handleSetMember(field, e) {
    setNewMember((member) => ({
      ...member,
      [field]: e.target.value.trim(),
    }));
  }

  function handleSignup() {
    axios
      .post("/api/member/signup", newMember)
      .then(() => {
        mytoast("회원가입 완료되었습니다.", "success");
        navigate("/");
      })
      .catch((e) => {
        if (e.response.status === 400) {
          if (e.response.data.password) {
            mytoast(e.response.data.password, "error");
          } else {
            mytoast("입력 값을 다시 확인해주세요", "error");
          }
        }
      })
      .finally(() => {
        setEmailCheck(false);
        setNickNameCheck(false);
      });
  }

  function handleSendEmail() {
    const email = new URLSearchParams();
    email.append("email", newMember.email);
    axios
      .post("/api/mail-send", email)
      .then((res) => {
        console.log(res.data);
        if (res.data === false) {
          mytoast("발송불가. 다시 확인해주세요", "error");
        } else {
          mytoast("이메일이 발송되었습니다. 확인해주세요");
        }
      })
      .catch((err) => {})
      .finally();
  }

  return (
    <Box>
      <Heading>회원가입</Heading>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"30%"}>
          <FormControl>
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
                  onClick={handleSignupNickNameCheck}
                  bgColor={"blue.400"}
                  color={"white"}
                  fontWeight={"medium"}
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
                value={newMember.password}
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
            <FormHelperText fontSize={"12px"}>
              8자 ~16자 이하 1개이상 영문자, 숫자, 특수문자 포함
            </FormHelperText>
            {!isCheckedPassword && (
              <FormHelperText>비밀번호 일치여부를 확인해주세요.</FormHelperText>
            )}
            <FormLabel>이메일</FormLabel>
            <InputGroup>
              <Input
                value={newMember.email}
                placeholder={"abc@abc.com"}
                onChange={(e) => {
                  handleSetMember("email", e);
                  setEmailCheck(false);
                }}
              />
              <InputRightElement w={75} mr={1}>
                <Button
                  onClick={handleSignupEmailCheck}
                  bgColor={"blue.400"}
                  color={"white"}
                  fontWeight={"medium"}
                  display={!emailCheck ? "block" : "none"}
                  // isDisabled={emailCheck}
                >
                  중복확인
                </Button>
                <Button
                  onClick={handleSendEmail}
                  bgColor={"blue.400"}
                  color={"white"}
                  fontWeight={"medium"}
                  display={emailCheck ? "block" : "none"}
                >
                  인증번호확인
                </Button>
              </InputRightElement>
            </InputGroup>
            <Flex justifyContent="center">
              <Button
                isDisabled={!emailCheck || !nickNameCheck || !passwordCheck}
                onClick={handleSignup}
                colorScheme={"purple"}
                w={120}
                my={3}
              >
                회원가입
              </Button>
            </Flex>
          </FormControl>
        </Center>
      </Flex>
    </Box>
  );
}
