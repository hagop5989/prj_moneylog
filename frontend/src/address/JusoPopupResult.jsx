import { useEffect } from "react";

function JusoPopupResult() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const addressData = {
      roadFullAddr: urlParams.get("roadFullAddr"),
      roadAddrPart1: urlParams.get("roadAddrPart1"),
      addrDetail: urlParams.get("addrDetail"),
      roadAddrPart2: urlParams.get("roadAddrPart2"),
      zipNo: urlParams.get("zipNo"),
    };

    window.opener.postMessage(addressData, window.location.origin); // 주소 데이터를 부모 컴포넌트로 전달
    window.close();
  }, []);

  return null;
}

export default JusoPopupResult;
