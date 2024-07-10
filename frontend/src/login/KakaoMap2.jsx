import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";

const { kakao } = window;

function KakaoMap2(props) {
  const [search, setSearch] = useState("");
  const [resultName, setResultName] = useState("검색결과");
  const [x, setX] = useState(126.945190775648); // 기본 좌표 (학원)
  const [y, setY] = useState(37.5564397859151); // 기본 좌표 (학원)
  const { isOpen, onClose, onOpen } = useDisclosure();
  const mapRef = useRef(null);

  function handleClose() {
    onClose();
    reloadMap(y, x, resultName);
  }

  function handleSubmitMap() {
    axios
      .post("/api/member/test", { x, y, resultName })
      .then()
      .catch()
      .finally();
  }

  function handleSearch() {
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(search, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const newX = result[0].x;
        const newY = result[0].y;
        setX(newX);
        setY(newY);
        reloadMap(newY, newX, resultName);
        onOpen();
      }
    });
  }

  function reloadMap(lat, lng, name) {
    if (!mapRef.current) {
      const mapContainer = document.getElementById("map");
      const mapOption = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 3,
      };
      const map = new kakao.maps.Map(mapContainer, mapOption);
      mapRef.current = map;
    }

    const map = mapRef.current;
    const coords = new kakao.maps.LatLng(lat, lng);
    const marker = new kakao.maps.Marker({
      map: map,
      position: coords,
    });

    const infoWindow = new kakao.maps.InfoWindow({
      content: `<div style="width:150px;text-align:center;padding:6px 0;">${name}</div>`,
    });
    infoWindow.open(map, marker);
    map.setCenter(coords);
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=c9b3b5ea56ef481752e865cdbbb0335c&libraries=services,clusterer,drawing&autoload=false";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        reloadMap(y, x, resultName);
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <Box>가게 주소 설정</Box>
      <Flex>
        <Input
          w={"50%"}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder={"정확한 주소를 입력해주세요."}
        />
        <Button colorScheme={"green"} onClick={handleSearch}>
          검색하기
        </Button>
      </Flex>
      <Box id={"map"} w={"500px"} h={"400px"} />
      <Button colorScheme={"blue"} onClick={handleSubmitMap}>
        주소 저장하기
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>가게명 입력</ModalHeader>
          <ModalBody>
            <Input
              value={resultName}
              onChange={(e) => {
                setResultName(e.target.value);
              }}
            />
            <Button onClick={handleClose}>설정</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default KakaoMap2;
