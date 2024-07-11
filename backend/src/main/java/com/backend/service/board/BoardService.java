package com.backend.service.board;

import com.backend.domain.board.Board;
import com.backend.mapper.board.BoardMapper;
import com.backend.mapper.board.modal.ModalMapper;
import com.backend.service.board.modal.ModalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardService {
    private final BoardMapper mapper;
    private final ModalService modalService;
    private final ModalMapper modalMapper;

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
        modalService.deleteByRowId(rowId);
        int i = mapper.deleteRowById(rowId);

    }

    public void updateRow(Board board) {
        String[] categories = board.getCategories();
        String categoriesToString = String.join(",", categories);

        mapper.updateRow(board, categoriesToString);
    }
}
