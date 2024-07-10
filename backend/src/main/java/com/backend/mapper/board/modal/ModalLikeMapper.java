package com.backend.mapper.board.modal;

import com.backend.domain.board.modal.Modal;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

@Mapper
public interface ModalLikeMapper {
    @Insert("""
            INSERT INTO modal_like(
            board_id,  like_state
            )VALUES (
            #{boardId},#{likeState}
            )
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Modal modal);
}
