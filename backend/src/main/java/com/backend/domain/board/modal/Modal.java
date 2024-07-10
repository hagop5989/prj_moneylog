package com.backend.domain.board.modal;

import lombok.Data;

import java.util.List;

@Data
public class Modal {
    private Integer id;
    private String nickName;
    private Integer boardId;
    private String text;

    private boolean likeState;
    private Integer likeNum;

    List<ModalFile> fileList;
}
