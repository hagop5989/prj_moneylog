import React from "react";
import { Flex } from "@chakra-ui/react";
import MiniBox from "./Minibox.jsx";

const MiniBoxGroup = ({ items, clickedList, handleMiniBoxChange }) => {
  return (
    <Flex>
      {items.map((item) => (
        <MiniBox
          key={item}
          text={item}
          clickedList={clickedList}
          handleMiniBoxChange={handleMiniBoxChange}
        />
      ))}
    </Flex>
  );
};

export default MiniBoxGroup;
