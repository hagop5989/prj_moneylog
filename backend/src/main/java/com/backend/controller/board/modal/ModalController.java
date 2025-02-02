package com.backend.controller.board.modal;

import com.backend.config.AuthId;
import com.backend.domain.board.modal.Modal;
import com.backend.service.board.modal.ModalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/board/modal")
public class ModalController {
    private final ModalService service;


    @GetMapping("list")
    public Map<String, Object> modalList(@RequestParam String boardId, @AuthId Integer memberId) {
        return service.modalList(boardId, memberId);
    }

    @PostMapping("insert")
    public void insert(@ModelAttribute Modal modal,
                       @RequestParam(value = "files[]", required = false) MultipartFile[] files,
                       @AuthId Integer memberId
    ) throws IOException {
        service.insert(modal, files, memberId);
    }

    @DeleteMapping("delete")
    public void delete(@RequestBody Modal modal) {
        service.delete(modal);
    }

    @PutMapping("update")
    public ResponseEntity update(@RequestBody Modal modal, @AuthId Integer memberId) {
        return service.update(modal, memberId);
    }

    @DeleteMapping("delete-img")
    public void deleteImage(@RequestParam String id, @RequestParam String fileName) {
        service.deleteImage(id, fileName);
    }

    @PostMapping("insert-file")
    public ResponseEntity insertFile(@RequestParam Integer modalId, @RequestParam(value = "files[]", required = false) MultipartFile[] files) throws IOException {
        return service.insertFile(modalId, files);
    }
}
