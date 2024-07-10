package com.backend.controller.board;

import com.backend.domain.board.Board;
import com.backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/board")
public class BoardController {
    private final BoardService service;

    @PostMapping("addRow")
    public void addRow(@RequestBody Board board) {
        service.addRow(board);
    }

    @GetMapping("list")
    public Map<String, Object> boardList() {
        List<Board> boards = service.boardList();
        return Map.of("boardList", boards);
    }

    @PutMapping("updateRow")
    public void updateRow(@RequestBody Board board) {
        service.updateRow(board);
    }

    @DeleteMapping("deleteRow")
    public void deleteRow(@RequestParam Integer rowId) {
        service.deleteRow(rowId);
    }
}
