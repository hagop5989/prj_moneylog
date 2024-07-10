package com.backend.mapper.member;

import com.backend.domain.member.Member;
import com.backend.domain.member.MemberSignupForm;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MemberMapper {

    @Insert("""
            INSERT INTO member(nick_name, email, password) 
            VALUES (#{nickName}, #{email}, #{password})
            """)
    void insert(MemberSignupForm member);


    @Select("""
            SELECT * FROM member
            WHERE email=#{email}
            """)
    Member findMemberByEmail(String email);

    @Select("""
            SELECT * FROM member
            WHERE nick_name = #{nickName}
            """)
    Member findMemberByNickName(String nickName);


    @Select("""
            SELECT * FROM member
            WHERE email = #{email}
            """)
    Member selectByMemberEmail(Member member);

    @Select("""
            SELECT * FROM authority
            WHERE member_id= #{memberId}
            """)
    List<String> selectAuthorityByMemberId(Integer memberId);


}
