package com.backend.service.board.modal;

import com.backend.domain.account.Account;
import com.backend.domain.board.modal.Modal;
import com.backend.domain.board.modal.ModalFile;
import com.backend.domain.card.Card;
import com.backend.mapper.board.modal.ModalMapper;
import com.backend.service.account.AccountService;
import com.backend.service.card.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ModalService {
    private final ModalMapper modalMapper;
    private final AccountService accountService;
    private final CardService cardService;
    final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    public void insert(Modal modal, MultipartFile[] files, Integer memberId) throws IOException {
        modal.setMemberId(memberId);
        modalMapper.insert(modal);
        // db 해당 게시물의 파일 목록 저장
        insertModalFiles(modal.getId(), files);
    }


    public Map<String, Object> modalList(String boardId, Integer memberId) {
        List<Modal> modalList = modalMapper.findAllModalList(boardId);
        List<Account> accountList = accountService.list(memberId);
        List<Card> cardList = cardService.list(memberId);
        setModalFileList(modalList);
        return Map.of("modalList", modalList, "accountList", accountList, "cardList", cardList);
    }


    public void delete(Modal modal) {
        Modal dbModal = modalMapper.selectByModalId(modal.getId());
        if (dbModal != null) {
            List<String> fileNames = modalMapper.selectFileNameByModalId(modal.getId());

            for (String fileName : fileNames) {
                String key = STR."prj2/\{modal.getId()}/\{fileName}";
                DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();

                s3Client.deleteObject(objectRequest);
            }
            modalMapper.deleteFileNameById(modal.getId());

            modalMapper.delete(dbModal);
        }
    }

    public ResponseEntity update(Modal modal, Integer memberId) {
        Integer[] modalIds = modalMapper.selectByMemberId(memberId);
        boolean idCheck = Arrays.stream(modalIds).anyMatch(id -> (modal.getId() == id));
        if (idCheck) {
            modalMapper.update(modal);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().body("memberId 불일치, 수정불가");
        }

    }

    public void deleteByRowId(Integer rowId) {
        modalMapper.selectByRowId(rowId).forEach(this::delete);
        // RowId 기준으로 모달을 찾아와서 삭제.

    }

    public void deleteImage(String id, String fileName) {
        String key = STR."prj2/\{id}/\{fileName}";
        DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        s3Client.deleteObject(objectRequest);
        modalMapper.deleteFileNameById(Integer.parseInt(id));

    }

    public ResponseEntity insertFile(Integer modalId, MultipartFile[] files) throws IOException {
        insertModalFiles(modalId, files);
        return ResponseEntity.ok().build();
    }


    // modal file 저장(db,s3) 메소드 추출.
    private void insertModalFiles(Integer modalId, MultipartFile[] files) throws IOException {
        if (files != null && modalId != null) {
            for (MultipartFile file : files) {
                modalMapper.insertFileName(modalId, file.getOriginalFilename());
                // 실제 파일 저장 (s3)
                String key = STR."prj2/\{modalId}/\{file.getOriginalFilename()}";
                PutObjectRequest objectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                s3Client.putObject(objectRequest,
                        RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            }
        }
    }

    // modalList 에 file 넣기.
    private void setModalFileList(List<Modal> modalList) {
        for (Modal modal : modalList) {
            List<String> fileNames = modalMapper.selectFileNameByModalId(modal.getId());
            List<ModalFile> files = fileNames.stream()
                    .map(name -> new ModalFile(name, STR."\{srcPrefix}\{modal.getId()}/\{name}"))
                    .toList();
            modal.setFileList(files);
        }
    }
}
