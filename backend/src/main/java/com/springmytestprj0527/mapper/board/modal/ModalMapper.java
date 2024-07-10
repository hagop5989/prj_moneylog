package com.springmytestprj0527.mapper.board.modal;

import com.springmytestprj0527.domain.board.modal.Modal;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ModalMapper {


    @Select("""
            SELECT *
            FROM modal
            WHERE board_id = #{boardId}
            """)
    List<Modal> findAllModalList(String boardId);

    @Insert("""
            INSERT INTO modal (nick_name, board_id, text,like_state)
            VALUES (#{nickName},#{boardId},#{text},#{likeState});
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Modal modal);

    @Delete("""
            DELETE FROM modal
            WHERE board_id = #{boardId}
            AND id = #{id}
            """)
    int delete(Modal modal);

    @Select("""
            SELECT * FROM modal
            WHERE id = #{id}
            """)
    Modal selectByModalId(Integer id);

    @Update("""
            UPDATE modal
            SET
            text = #{text},
            like_state = #{likeState}
            WHERE id = #{id}
            """)
    int update(Modal modal);

    @Insert("""
            INSERT INTO modal_file (modal_id, name)
            VALUES (#{modalId},#{name})
            """)
    int insertFileName(Integer modalId, String name);


    @Select("""
            SELECT name FROM modal_file
            WHERE modal_id = #{modalId}
            """)
    List<String> selectFileNameByModalId(Integer modalId);

    @Delete("""
            DELETE FROM modal_file
            WHERE modal_id = #{modalId}
            """)
    int deleteFileNameById(Integer modalId);

}
