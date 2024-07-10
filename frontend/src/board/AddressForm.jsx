import React, { useEffect, useState } from "react";
import { Box, Input, InputGroup, InputRightElement } from "@chakra-ui/react";

const AddressForm = () => {
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [extraAddress, setExtraAddress] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  useEffect(() => {
    // Daum Postcode API 스크립트가 로드되었는지 확인
    if (!window.daum) {
      const script = document.createElement("script");
      script.src =
        "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.async = true;
      script.onload = () => {
        console.log("Daum Postcode API loaded");
      };
      document.head.appendChild(script);
    }
  }, []);

  const handlePostcode = () => {
    if (!window.daum || !window.daum.Postcode) {
      console.error("Daum Postcode API is not loaded yet.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        let addr = ""; // 주소 변수
        let extraAddr = ""; // 참고항목 변수

        if (data.userSelectedType === "R") {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }

        if (data.userSelectedType === "R") {
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraAddr +=
              extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
          }
          if (extraAddr !== "") {
            extraAddr = " (" + extraAddr + ")";
          }
          setExtraAddress(extraAddr);
        } else {
          setExtraAddress("");
        }

        setPostcode(data.zonecode);
        setAddress(addr);
        document.getElementById("detailAddress").focus();
      },
    }).open();
  };

  return (
    <Box>
      <Input
        type="button"
        cursor={"pointer"}
        bgColor={"green.400"}
        onClick={handlePostcode}
        value="주소 찾기"
      />
      {/*<Input*/}
      {/*  type="text"*/}
      {/*  id="postcode"*/}
      {/*  placeholder="우편번호"*/}
      {/*  value={postcode}*/}
      {/*  readOnly*/}
      {/*/>*/}

      <br />
      <InputGroup>
        <InputRightElement w={"100px"}>{extraAddress}</InputRightElement>
        <Input
          type="text"
          id="address"
          placeholder="주소"
          value={address}
          readOnly
        />
      </InputGroup>
      <Input
        type="text"
        id="detailAddress"
        placeholder="상세주소"
        value={detailAddress}
        onChange={(e) => setDetailAddress(e.target.value)}
      />
    </Box>
  );
};

export default AddressForm;
