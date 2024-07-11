package com.backend.controller.member;

import com.backend.domain.member.Member;
import com.backend.domain.member.MemberSignupForm;
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


    @PostMapping("signup")
    public ResponseEntity signup(@Validated @RequestBody MemberSignupForm form, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(getErrorMessages(bindingResult));
        }
        service.insert(form);
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "signupCheck", params = "email")
    public ResponseEntity signupEmailCheck(@Validated @ModelAttribute MemberSignupForm form, BindingResult bindingResult) {
        if (bindingResult.hasFieldErrors("email")) {
            return ResponseEntity.badRequest().body(getErrorMessages(bindingResult, "email"));
        }
        return service.signupEmailCheck(form.getEmail());
    }


    @GetMapping(value = "signupCheck", params = "nickName")
    public ResponseEntity signupNickNameCheck(@Validated @ModelAttribute MemberSignupForm form, BindingResult bindingResult) {
        if (bindingResult.hasFieldErrors("nickName")) {
            return ResponseEntity.badRequest().body(getErrorMessages(bindingResult, "nickName"));
        }
        return service.signupNickNameCheck(form.getNickName());
    }

    @PostMapping("token")
    public ResponseEntity token(@RequestBody Member member) {
        System.out.println("member = " + member);
        Map<String, Object> token = service.getToken(member);
        System.out.println("service.getToken(member) = " + service.getToken(member));
        if (token == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(token);
    }


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
