package com.expensetracker.service;

import com.expensetracker.dto.CategorySummary;
import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.dto.ExpenseSummaryResponse;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.model.Category;
import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getAllExpenses(String category, String search) {
        List<Expense> expenses;

        boolean hasCategory = category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("All");
        boolean hasSearch = search != null && !search.trim().isEmpty();

        if (hasCategory && hasSearch) {
            expenses = expenseRepository.findByCategoryAndKeyword(category.trim(), search.trim());
        } else if (hasCategory) {
            expenses = expenseRepository.findByCategoryIgnoreCaseOrderByDateDesc(category.trim());
        } else if (hasSearch) {
            expenses = expenseRepository.searchByKeyword(search.trim());
        } else {
            expenses = expenseRepository.findAllByOrderByDateDesc();
        }

        return expenses.stream()
                .map(ExpenseResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));
        return ExpenseResponse.fromEntity(expense);
    }

    public ExpenseResponse createExpense(ExpenseRequest request) {
        validateRequest(request);

        Expense expense = new Expense(
                request.getTitle().trim(),
                request.getAmount(),
                normalizeCategory(request.getCategory()),
                request.getDate(),
                request.getNotes() != null ? request.getNotes().trim() : null
        );

        Expense saved = expenseRepository.save(expense);
        return ExpenseResponse.fromEntity(saved);
    }

    public ExpenseResponse updateExpense(Long id, ExpenseRequest request) {
        validateRequest(request);

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));

        expense.setTitle(request.getTitle().trim());
        expense.setAmount(request.getAmount());
        expense.setCategory(normalizeCategory(request.getCategory()));
        expense.setDate(request.getDate());
        expense.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);

        Expense updated = expenseRepository.save(expense);
        return ExpenseResponse.fromEntity(updated);
    }

    public void deleteExpense(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));
        expenseRepository.delete(expense);
    }

    @Transactional(readOnly = true)
    public ExpenseSummaryResponse getSummary() {
        List<Expense> allExpenses = expenseRepository.findAll();

        if (allExpenses.isEmpty()) {
            return new ExpenseSummaryResponse(
                    BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP),
                    0,
                    BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP),
                    BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP),
                    Collections.emptyList()
            );
        }

        BigDecimal totalAmount = allExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        long totalCount = allExpenses.size();

        BigDecimal averageAmount = totalAmount.divide(BigDecimal.valueOf(totalCount), 2, RoundingMode.HALF_UP);

        BigDecimal highestAmount = allExpenses.stream()
                .map(Expense::getAmount)
                .max(Comparator.naturalOrder())
                .orElse(BigDecimal.ZERO)
                .setScale(2, RoundingMode.HALF_UP);

        // Group by category
        Map<String, List<Expense>> grouped = allExpenses.stream()
                .collect(Collectors.groupingBy(Expense::getCategory));

        List<CategorySummary> breakdowns = new ArrayList<>();
        for (Map.Entry<String, List<Expense>> entry : grouped.entrySet()) {
            String cat = entry.getKey();
            List<Expense> list = entry.getValue();

            BigDecimal catTotal = list.stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .setScale(2, RoundingMode.HALF_UP);

            double percentage = totalAmount.compareTo(BigDecimal.ZERO) > 0
                    ? catTotal.divide(totalAmount, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue()
                    : 0.0;

            breakdowns.add(new CategorySummary(cat, catTotal, list.size(), Math.round(percentage * 100.0) / 100.0));
        }

        // Sort breakdowns descending by total amount
        breakdowns.sort((a, b) -> b.getTotalAmount().compareTo(a.getTotalAmount()));

        return new ExpenseSummaryResponse(totalAmount, totalCount, averageAmount, highestAmount, breakdowns);
    }

    @Transactional(readOnly = true)
    public List<String> getCategories() {
        Set<String> categories = new LinkedHashSet<>();
        // Standard categories first
        for (Category c : Category.values()) {
            categories.add(c.getDisplayName());
        }
        // Add any additional distinct categories in DB
        List<String> dbCategories = expenseRepository.findDistinctCategories();
        if (dbCategories != null) {
            categories.addAll(dbCategories);
        }
        return new ArrayList<>(categories);
    }

    private void validateRequest(ExpenseRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body cannot be null");
        }
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be empty");
        }
        if (request.getAmount() == null) {
            throw new IllegalArgumentException("Amount is required");
        }
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
        if (request.getCategory() == null || request.getCategory().trim().isEmpty()) {
            throw new IllegalArgumentException("Category is required");
        }
        if (request.getDate() == null) {
            throw new IllegalArgumentException("Date is required");
        }
    }

    private String normalizeCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            return Category.OTHER.getDisplayName();
        }
        Category matched = Category.fromString(category.trim());
        return matched.getDisplayName();
    }
}
