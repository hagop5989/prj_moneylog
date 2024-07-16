package com.backend.domain.board.modal;

import lombok.Data;

import java.util.List;

@Data
public class Modal {
    private Integer id;
    private Integer boardId;
    private Integer memberId;
    private String nickName;
    private String text;

    private boolean likeState;
    private Integer likeNum;

    List<ModalFile> fileList;
}
