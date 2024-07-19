import React from "react";
import { Box } from "@chakra-ui/react";

const MiniBox = ({ text, clickedList, handleMiniBoxChange }) => {
  const isSelected = clickedList.includes(text);

  return (
    <Box
      aria-valuetext={text}
      onClick={() => handleMiniBoxChange(text)}
      bgColor={isSelected ? "blue.100 " : ""}
      boxSize={"50px"}
      border={"2px solid gray"}
      borderRadius={"5px"}
      textAlign="center"
      lineHeight={"50px"}
      cursor={"pointer"}
      margin={"2px"}
    >
      {text}
    </Box>
  );
};

export default MiniBox;
