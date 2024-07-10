package com.backend.domain.board;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class Board {
    private Integer id;

    private LocalDate date;
    private Integer income;
    private Integer expense;
    private Integer rowSum;

    private String how;

    private String[] categories;
    private String stringCategories;

    public Board(Integer id, LocalDate date, Integer income, Integer expense, Integer rowSum, String how, String[] categories, String stringCategories) {
        this.id = id;
        this.date = date;
        this.income = income;
        this.expense = expense;
        this.rowSum = income - expense;
        this.how = how;
        this.categories = categories;
        this.stringCategories = stringCategories;
    }

}
