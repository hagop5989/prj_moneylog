import React, { useEffect, useState } from "react";

function AddressSearch() {
  const [address, setAddress] = useState({
    roadFullAddr: "",
    roadAddrPart1: "",
    addrDetail: "",
    roadAddrPart2: "",
    zipNo: "",
  });

  useEffect(() => {
    const handlePopupResult = (event) => {
      if (event.origin !== window.location.origin) return;
      const { roadFullAddr, roadAddrPart1, addrDetail, roadAddrPart2, zipNo } =
        event.data;
      setAddress({
        roadFullAddr,
        roadAddrPart1,
        addrDetail,
        roadAddrPart2,
        zipNo,
      });
    };

    window.addEventListener("message", handlePopupResult);

    return () => {
      window.removeEventListener("message", handlePopupResult);
    };
  }, []);

  return (
    <div>
      <button
        onClick={() =>
          window.open(
            "/jusoPopup",
            "pop",
            "width=570,height=420,scrollbars=yes,resizable=yes",
          )
        }
      >
        주소 검색
      </button>
      <div>
        <p>도로명 주소: {address.roadFullAddr}</p>
        <p>지번 주소: {address.roadAddrPart1}</p>
        <p>상세 주소: {address.addrDetail}</p>
        <p>참고 항목: {address.roadAddrPart2}</p>
        <p>우편번호: {address.zipNo}</p>
      </div>
    </div>
  );
}

export default AddressSearch;
