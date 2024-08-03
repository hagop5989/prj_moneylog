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
  Text,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {myToast} from "../App.jsx";

export function Signup() {
  const [newMember, setNewMember] = useState({
    nickName: "",
    password: "",
    email: "",
  });
  const [passwordCheck, setPasswordCheck] = useState("");
  const isCheckedPassword = newMember.password === passwordCheck;
  const [emailCheck, setEmailCheck] = useState(false);
  const [sendNumBtnHide, setSendNumBtnHide] = useState(false);
  const [nickNameCheck, setNickNameCheck] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [pwdShow, setPwdShow] = useState(false);
  const [numCheckShow, setNumCheckShow] = useState(false);
  const [numbers, setNumbers] = useState("");
  const [seconds, setSeconds] = useState(120);
  const [isActive, setIsActive] = useState(false);

  const handlePwdClick = () => setPwdShow(!pwdShow);
  // const handlePwdCheckClick = () => setPwdCheckShow(!pwdCheckShow);


  function handleSignupEmailCheck() {
    axios
      .get(`/api/member/signupCheck?email=${newMember.email}`)
      .then(() => {
        myToast(toast,"회원가입 가능합니다.", "info");
        setEmailCheck(true);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          myToast(toast,err.response.data.email, "error");
          setEmailCheck(false);
        }
      })
      .finally(() => {});
  }

  function handleSignupNickNameCheck() {
    axios
      .get(`/api/member/signupCheck?nickName=${newMember.nickName}`)
      .then(() => {
        myToast(toast,"회원가입 가능합니다.", "info");
        setNickNameCheck(true);
      })
      .catch((err) => {
        if (err.response.status === 400 && err.response.data.nickName) {
          myToast(toast,err.response.data.nickName , "error");
        } else {
          myToast(toast,err.response.data, "error");
        }
        setNickNameCheck(false);
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
        myToast(toast,"회원가입 완료되었습니다.", "success");
        navigate("/");
      })
      .catch((e) => {
        if (e.response.status === 400) {
          if (e.response.data.password) {
            myToast(toast,e.response.data.password, "error");
          } else {
            myToast(toast,"입력 값을 다시 확인해주세요", "error");
            navigate("/signup");
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
          myToast(toast,"발송불가. 다시 확인해주세요", "error");
        } else {
          myToast(toast,"이메일이 발송되었습니다. 확인해주세요");
          setSeconds(120);
          startCountdown();
          setNumCheckShow(true);
        }
      })
      .catch((err) => {})
      .finally();
  }

  const buttonStyle = () => ({
    bgColor: "blue.400",
    color: "white",
    fontWeight: "medium",
  });

  function handleNumCheck() {
    axios
      .get("api/num-check", { params: { numbers, email: newMember.email } })
      .then((res) => {
        if (res.status === 200) {
          alert("인증완료");
          setNumCheckShow(false);
          setSendNumBtnHide(true);
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          alert("인증오류발생. 다시 확인해주세요");
        }
      });
  }

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      clearInterval(interval);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const startCountdown = () => {
    setIsActive(true);
  };

  return (
    <Box>
      <Heading>회원가입</Heading>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"50%"}>
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
              <InputRightElement w={"100px"}>
                <Button
                  minW={"80px"}
                  onClick={handleSignupEmailCheck}
                  {...buttonStyle()}
                  display={!emailCheck ? "block" : "none"}

                >
                  <Text>중복확인</Text>
                </Button>

                <Button
                  minW={"120px"}
                  onClick={handleSendEmail}
                  {...buttonStyle()}
                  display={emailCheck ? "block" : "none"}
                  isDisabled={sendNumBtnHide}
                >
                  인증번호발송
                </Button>
              </InputRightElement>
            </InputGroup>
            {numCheckShow && seconds > 0 && (
              <FormHelperText> {seconds}초 내에 인증해주세요.</FormHelperText>
            )}
            {numCheckShow && (
              <Box>
                인증번호확인
                <InputGroup>
                  <Input
                    type={"number"}
                    onChange={(e) => {
                      setNumbers(e.target.value);
                    }}
                  />
                  <InputRightElement>
                    <Button
                      minW={"60px"}
                      onClick={handleNumCheck}
                      {...buttonStyle()}
                    >
                      확인
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>
            )}
            <Flex justifyContent="center">
              <Button
                isDisabled={!emailCheck || !nickNameCheck || !isCheckedPassword}
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
