package com.backend.service.board.modal;

import com.backend.domain.board.modal.Modal;
import com.backend.domain.board.modal.ModalFile;
import com.backend.mapper.board.modal.ModalMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ModalService {
    private final ModalMapper modalMapper;
    final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    public void insert(Modal modal, MultipartFile[] files) throws IOException {
        modalMapper.insert(modal);
        // db 해당 게시물의 파일 목록 저장
        if (files != null) {
            for (MultipartFile file : files) {
                modalMapper.insertFileName(modal.getId(), file.getOriginalFilename());
                // 실제 파일 저장 (s3)
                String key = STR."prj2/\{modal.getId()}/\{file.getOriginalFilename()}";
                PutObjectRequest objectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                s3Client.putObject(objectRequest,
                        RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

//                 부모 디렉토리 만들기
//                String dir = STR."C:/Temp/prj3/\{modal.getId()}";
//                File dirFile = new File(dir);
//                if (!dirFile.exists()) {
//                    dirFile.mkdirs();
//                }
//                // 파일 경로
//                String path = STR."C:/Temp/prj3/\{modal.getId()}/\{file.getOriginalFilename()}";
//                File destination = new File(path);
//                file.transferTo(destination);
            }
//            List<String> foundFile
//                    = modalMapper.selectFileNameByModalId(modal.getId());
//            System.out.println("저장한 파일  = " + foundFile.toString());
            // 실제 파일 저장
        }
    }

    public List<Modal> modalList(String boardId) {
        List<Modal> modalList = modalMapper.findAllModalList(boardId);
        for (Modal modal : modalList) {
            List<String> fileNames = modalMapper.selectFileNameByModalId(modal.getId());
            List<ModalFile> files = fileNames.stream()
                    .map(name -> new ModalFile(name, STR."\{srcPrefix}\{modal.getId()}/\{name}"))
                    .toList();
            modal.setFileList(files);
        }
        return modalList;
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

            int delete = modalMapper.delete(dbModal);
            System.out.println("delete개수 = " + delete);
        }
    }

    public void update(Modal modal) {
        modalMapper.update(modal);

    }

    public void deleteByRowId(Integer rowId) {
        List<Modal> modals = modalMapper.selectByRowId(rowId);
        // RowId 기준으로 모달을 찾아와서 삭제.
        for (Modal modal : modals) {
            delete(modal);
        }
    }
}
