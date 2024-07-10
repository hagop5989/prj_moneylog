import React from "react";

function JusoPopup() {
  const openPopup = () => {
    const returnUrl = encodeURIComponent(
      window.location.origin + "/jusoPopupResult",
    );
    const serviceKey = "devU01TX0FVVEgyMDI0MDYxMDIxNTMyMDExNDgzMjI=";
    const popup = window.open(
      `https://business.juso.go.kr/addrlink/addrLinkUrl.do?confmKey=${serviceKey}&returnUrl=${returnUrl}&resultType=4`,
      "pop",
      "width=570,height=420,scrollbars=yes,resizable=yes",
    );

    // 추가된 부분: 데이터 부모 컴포넌트로 전송
    window.addEventListener(
      "message",
      (event) => {
        if (event.origin !== window.location.origin) return;
        const {
          roadFullAddr,
          roadAddrPart1,
          addrDetail,
          roadAddrPart2,
          zipNo,
        } = event.data;
        window.opener.postMessage(
          { roadFullAddr, roadAddrPart1, addrDetail, roadAddrPart2, zipNo },
          window.location.origin,
        );
      },
      { once: true },
    );
  };

  return <button onClick={openPopup}>주소 검색</button>;
}

export default JusoPopup;
