package com.backend.mapper.board.modal;

import com.backend.domain.board.modal.Modal;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ModalMapper {


    @Select("""
            SELECT m.*, mem.nick_name
            FROM modal m 
            JOIN member mem ON mem.id = m.member_id
            WHERE m.board_id = #{boardId}
            """)
    List<Modal> findAllModalList(String boardId);

    @Insert("""
            INSERT INTO modal (board_id, member_id, text,like_state)
            VALUES (#{boardId},#{memberId},#{text},#{likeState});
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


    @Select("""
            SELECT * 
            FROM modal 
            WHERE board_id = #{rowId}
            """)
    List<Modal> selectByRowId(Integer rowId);


    @Select("""
            SELECT modal.id FROM modal
            WHERE member_id = #{memberId}
            """)
    Integer[] selectByMemberId(Integer memberId);

}
