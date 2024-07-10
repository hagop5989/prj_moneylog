package com.springmytestprj0527.mapper.board;

import com.springmytestprj0527.domain.board.Board;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Insert("""
            INSERT INTO board
            (date, income, expense, categories, how,rowSum)
            VALUES(#{board.date},
                 #{board.income},
                 #{board.expense},
                 #{categoriesToString},
                 #{board.how},
                 #{board.rowSum}
                 )
            """)
    int addRow(Board board, String categoriesToString);

    @Select("""
            SELECT
            id,date, income, expense, categories AS stringCategories, how , rowSum
            FROM board
            ORDER BY id DESC
            """)
    List<Board> findAllBoardList();

    @Delete("""
            DELETE FROM board
            WHERE id=#{id}
            """)
    int deleteRowById(Integer id);

    @Update("""
            UPDATE board
            SET
                date=#{board.date},
                income=#{board.income},
                expense=#{board.expense},
                how=#{board.how},
                categories = #{categoriesToString},
                rowSum=#{board.rowSum}
                WHERE id=#{board.id}
            """)
    int updateRow(Board board, String categoriesToString);
}
