import React from "react";
import { Box, Input, Select } from "@chakra-ui/react";

const MiniBox = ({
  text,
  clickedList,
  handleMiniBoxChange,
  borderColor = "gray",
  bgColor = clickedList.includes(text) ? "blue.100 " : "",
}) => {

  return (
    <Box>
      <Box
        aria-valuetext={text}
        onClick={() => handleMiniBoxChange(text)}
        bgColor={bgColor}
        boxSize={"50px"}
        lineHeight={"50px"}
        borderWidth={"2px"}
        borderColor={borderColor}
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
