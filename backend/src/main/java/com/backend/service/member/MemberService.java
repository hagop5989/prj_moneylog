package com.backend.service.member;

import com.backend.domain.member.Member;
import com.backend.domain.member.MemberForm;
import com.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class MemberService {
    private final MemberMapper mapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;


    public void insert(MemberForm form) {
        form.setPassword(passwordEncoder.encode(form.getPassword())); // pw 인코딩
        form.setEmail(form.getEmail().trim());
        form.setNickName(form.getNickName().trim());

        mapper.insert(form);
    }

    public ResponseEntity signupEmailCheck(String email) {
        Member foundMember = mapper.findMemberByEmail(email);
        if (foundMember == null) {
            // 이메일 중복 아님
            return ResponseEntity.ok(email);
        }
        if (email != null && foundMember != null) {
            // 이메일 중복 시
            return ResponseEntity.badRequest().build();
        }
        // 위 케이스가 아닌데 오류 시 500 에러
        return ResponseEntity.internalServerError().build();
    }

    public ResponseEntity signupNickNameCheck(String nickName) {
        Member foundMember = mapper.findMemberByNickName(nickName);
        if (foundMember == null) {
            // 이름 중복 아님
            return ResponseEntity.ok(nickName);
        }
        else if (foundMember != null) {
            // 이름 중복 시
            return ResponseEntity.badRequest().body("중복 닉네임 입니다.");
        }
        // 위 케이스가 아닌데 오류 시 500 에러
        return ResponseEntity.internalServerError().build();
    }


    public Map<String, Object> getToken(Member member) {

        Map<String, Object> result = null;

        Member dbMember = mapper.selectByMemberEmail(member);
        System.out.println("dbMember = " + dbMember);
        if (dbMember != null) {
            if (passwordEncoder.matches(member.getPassword(), dbMember.getPassword())) {
                result = new HashMap<>();
                String token = "";
                Instant now = Instant.now();

                List<String> authority = mapper.selectAuthorityByMemberId(member.getId());

                String authorityString = authority.stream()
                        .collect(Collectors.joining(" "));

                // https://github.com/spring-projects/spring-security-samples/blob/main/servlet/spring-boot/java/jwt/login/src/main/java/example/web/TokenController.java
                JwtClaimsSet claims = JwtClaimsSet.builder()
                        .issuer("self")
                        .issuedAt(now)
                        .expiresAt(now.plusSeconds(60 * 60 * 24 * 7))
                        .subject(dbMember.getId().toString())
                        .claim("scope", authorityString) // 권한
                        .claim("nickName", dbMember.getNickName())
                        .build();

                token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

                result.put("token", token);
            }
        }
        return result;
    }

    public boolean findByEmail(String email) {
        if (mapper.findMemberByEmail(email) == null) {
            return false;
        }
        return true;
    }

    public Member updateLoad(Integer memberId) {
        return mapper.selectByMemberId(memberId);

    }

    public void update(MemberForm form, Integer memberId) {
        form.setId(memberId);
        form.setPassword(passwordEncoder.encode(form.getPassword())); // pw 인코딩
        mapper.update(form);

    }
}
