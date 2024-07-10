package com.springmytestprj0527.service.member;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class MailService {

    private final JavaMailSender javaMailSender;
    private static final String senderEmail = "devds5989@gmail.com";
    private static ThreadLocal<Integer> numbers = new ThreadLocal<>();

    public MimeMessage createMail(String mail) {
        int number = (int) ((Math.random() * 90000) + 100000);
        numbers.set(number);
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            message.setFrom(senderEmail);
            message.setRecipients(MimeMessage.RecipientType.TO, mail);
            message.setSubject("[ds5989] 인증번호 수신 메일입니다.");
            String body = STR."""
                    <h1>[ds5989]</h1>
                    <br>
                    <h3>인증번호는 \{numbers.get()} 입니다.</h3>
                    """;
            message.setText(body, "UTF-8", "html");
            System.out.println("MailService.createMail try");
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("MailService.createMail error");
        }
        return message;
    }

    public int sendMail(String mail) {
        MimeMessage message = createMail(mail);
        javaMailSender.send(message);
        return numbers.get();
    }

    public boolean checkRegex(String email) {
        String regex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        return Pattern.matches(regex, email);
    }
}
