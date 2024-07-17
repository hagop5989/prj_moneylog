package com.backend.controller;

import com.backend.service.member.MailService;
import com.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {
    private final MailService mailService;
    private static Map<String, String> numbers = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(10);
    private final MemberService memberService;

    @PostMapping("/mail-send")
    public ResponseEntity mailSend(@RequestParam String email) {

        if (!mailService.checkRegex(email)) {
            return ResponseEntity.badRequest().build();
        }
        if (memberService.findByEmail(email)) {
            return ResponseEntity.ok().body(false);
        }

        try {
            String number = String.valueOf(mailService.sendMail(email));
            putValue(email, number);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e);
        }
        return null;
    }

    @GetMapping("num-check")
    public ResponseEntity numCheck(@RequestParam String email, @RequestParam String numbers) {
        boolean numberCheck = this.numbers.get(email).equals(numbers);
        if (numberCheck) {
            return ResponseEntity.ok().body(true);
        }
        return ResponseEntity.badRequest().build();
    }

    private void scheduleRemoval(String key, long delay, TimeUnit unit) {
        scheduler.schedule(() -> {
            numbers.remove(key);
        }, delay, unit);
    }

    private void putValue(String key, String value) {
        numbers.put(key, value);
        scheduleRemoval(key, 2, TimeUnit.MINUTES);
    }

    public boolean checkMemberId(String memberId) {
        return false;
    }

}
