package com.backend.controller.member;

import com.backend.config.AuthId;
import com.backend.domain.member.Member;
import com.backend.domain.member.MemberForm;
import com.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService service;

    @GetMapping(value = "signupCheck", params = "email")
    public ResponseEntity signupEmailCheck(@Validated @ModelAttribute MemberForm form, BindingResult bindingResult) {
        if (bindingResult.hasFieldErrors("email")) {
            return ResponseEntity.badRequest().body(getErrorMessages(bindingResult, "email"));
        }
        return service.signupEmailCheck(form.getEmail());
    }

    @GetMapping(value = "signupCheck", params = "nickName")
    public ResponseEntity signupNickNameCheck(@Validated @ModelAttribute MemberForm form, BindingResult bindingResult) {
        if (bindingResult.hasFieldErrors("nickName")) {
            return ResponseEntity.badRequest().body(getErrorMessages(bindingResult, "nickName"));
        }
        return service.signupNickNameCheck(form.getNickName());
    }

    @PostMapping("signup")
    public ResponseEntity signup(@Validated @RequestBody MemberForm form, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(getErrorMessages(bindingResult));
        }
        service.insert(form);
        return ResponseEntity.ok().build();
    }

    @PostMapping("token")
    public ResponseEntity token(@RequestBody Member member) {
        Map<String, Object> token = service.getToken(member);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(token);
    }

    @GetMapping("update")
    public Member updateLoad(@AuthId Integer memberId) {
        return service.updateLoad(memberId);
    }

    @PutMapping("update")
    public void update(@Validated @RequestBody MemberForm form, @AuthId Integer memberId) {
        service.update(form, memberId);
    }


    // 에러메세지 관련 메소드 들
    private static Map<String, String> getErrorMessages(BindingResult bindingResult) {
        return getErrorMessages(bindingResult, null);
    }

    private static Map<String, String> getErrorMessages(BindingResult bindingResult, String field) {
        Map<String, String> errors = new ConcurrentHashMap<>();
        if (field == null) {
            for (FieldError error : bindingResult.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
        } else {
            for (FieldError error : bindingResult.getFieldErrors(field)) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
        }
        return errors;
    }

}
