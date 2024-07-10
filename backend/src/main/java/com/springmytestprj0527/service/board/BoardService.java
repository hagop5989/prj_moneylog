package com.springmytestprj0527.service.board;

import com.springmytestprj0527.domain.board.Board;
import com.springmytestprj0527.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardService {
    private final BoardMapper mapper;

    public void addRow(Board board) {
        String[] categories = board.getCategories();
        String categoriesToString = String.join(",", categories);

        int addedRow = mapper.addRow(board, categoriesToString);
    }

    public List<Board> boardList() {
        List<Board> allBoardList = mapper.findAllBoardList();
        for (Board board : allBoardList) {
            String[] categories = board.getStringCategories().split(",");
            board.setCategories(categories);
        }

        return allBoardList;
    }

    public void deleteRow(Integer rowId) {
        int i = mapper.deleteRowById(rowId);

    }

    public void updateRow(Board board) {
        String[] categories = board.getCategories();
        String categoriesToString = String.join(",", categories);

        mapper.updateRow(board, categoriesToString);
    }
}
