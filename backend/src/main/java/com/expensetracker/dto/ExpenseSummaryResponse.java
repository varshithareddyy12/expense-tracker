package com.expensetracker.dto;

import java.math.BigDecimal;
import java.util.List;

public class ExpenseSummaryResponse {
    private BigDecimal totalAmount;
    private long totalCount;
    private BigDecimal averageAmount;
    private BigDecimal highestAmount;
    private List<CategorySummary> categoryBreakdowns;

    public ExpenseSummaryResponse() {
    }

    public ExpenseSummaryResponse(BigDecimal totalAmount, long totalCount, BigDecimal averageAmount, BigDecimal highestAmount, List<CategorySummary> categoryBreakdowns) {
        this.totalAmount = totalAmount;
        this.totalCount = totalCount;
        this.averageAmount = averageAmount;
        this.highestAmount = highestAmount;
        this.categoryBreakdowns = categoryBreakdowns;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(long totalCount) {
        this.totalCount = totalCount;
    }

    public BigDecimal getAverageAmount() {
        return averageAmount;
    }

    public void setAverageAmount(BigDecimal averageAmount) {
        this.averageAmount = averageAmount;
    }

    public BigDecimal getHighestAmount() {
        return highestAmount;
    }

    public void setHighestAmount(BigDecimal highestAmount) {
        this.highestAmount = highestAmount;
    }

    public List<CategorySummary> getCategoryBreakdowns() {
        return categoryBreakdowns;
    }

    public void setCategoryBreakdowns(List<CategorySummary> categoryBreakdowns) {
        this.categoryBreakdowns = categoryBreakdowns;
    }
}

