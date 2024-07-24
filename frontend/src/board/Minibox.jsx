import React from "react";
import { Box, Input, Select } from "@chakra-ui/react";

const MiniBox = ({ text, clickedList, handleMiniBoxChange }) => {
  const isSelected = clickedList.includes(text);

  return (
    <Box>
      <Box
        aria-valuetext={text}
        onClick={() => handleMiniBoxChange(text)}
        bgColor={isSelected ? "blue.100 " : ""}
        boxSize={"50px"}
        lineHeight={"50px"}
        border={"2px solid gray"}
        borderRadius={"5px"}
        textAlign="center"
        cursor={"pointer"}
        margin={"2px"}
      >
        {text}
      </Box>
    </Box>
  );
};

export default MiniBox;
