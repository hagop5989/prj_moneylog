package com.backend.domain.member;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class MemberForm {
    private Integer id;
    @NotBlank
    @Pattern(regexp = "^[가-힣]{2,5}$", message = "한글사용, 최소 2자, 최대 5자 가능합니다.")
    private String nickName;
    @NotBlank
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "형식에 맞춰 작성해 주세요.")
    private String email;
    @NotBlank
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\\d~!@#$%^&*()+|=]{8,16}$", message = "형식에 맞춰 작성해 주세요.")
    private String password;
    private String authority;
}
