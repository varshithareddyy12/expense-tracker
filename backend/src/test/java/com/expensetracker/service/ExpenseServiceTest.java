package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.dto.ExpenseSummaryResponse;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.model.Category;
import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @InjectMocks
    private ExpenseService expenseService;

    private Expense testExpense;

    @BeforeEach
    void setUp() {
        testExpense = new Expense("Groceries", new BigDecimal("50.00"), "Food", LocalDate.now(), "Weekly items");
        testExpense.setId(1L);
    }

    @Test
    void testCreateExpense_Success() {
        ExpenseRequest request = new ExpenseRequest("Groceries", new BigDecimal("50.00"), "Food", LocalDate.now(), "Weekly items");
        when(expenseRepository.save(any(Expense.class))).thenReturn(testExpense);

        ExpenseResponse response = expenseService.createExpense(request);

        assertNotNull(response);
        assertEquals("Groceries", response.getTitle());
        assertEquals(new BigDecimal("50.00"), response.getAmount());
        assertEquals("Food", response.getCategory());
        verify(expenseRepository, times(1)).save(any(Expense.class));
    }

    @Test
    void testCreateExpense_ThrowsOnEmptyTitle() {
        ExpenseRequest request = new ExpenseRequest("   ", new BigDecimal("50.00"), "Food", LocalDate.now(), null);
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            expenseService.createExpense(request);
        });
        assertEquals("Title cannot be empty", exception.getMessage());
        verify(expenseRepository, never()).save(any());
    }

    @Test
    void testCreateExpense_ThrowsOnZeroOrNegativeAmount() {
        ExpenseRequest zeroRequest = new ExpenseRequest("Item", BigDecimal.ZERO, "Other", LocalDate.now(), null);
        assertThrows(IllegalArgumentException.class, () -> expenseService.createExpense(zeroRequest));

        ExpenseRequest negativeRequest = new ExpenseRequest("Item", new BigDecimal("-10.00"), "Other", LocalDate.now(), null);
        assertThrows(IllegalArgumentException.class, () -> expenseService.createExpense(negativeRequest));

        verify(expenseRepository, never()).save(any());
    }

    @Test
    void testGetExpenseById_Success() {
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(testExpense));

        ExpenseResponse response = expenseService.getExpenseById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Groceries", response.getTitle());
    }

    @Test
    void testGetExpenseById_NotFound() {
        when(expenseRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> expenseService.getExpenseById(999L));
    }

    @Test
    void testUpdateExpense_Success() {
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(testExpense));
        when(expenseRepository.save(any(Expense.class))).thenReturn(testExpense);

        ExpenseRequest updateRequest = new ExpenseRequest("Updated Title", new BigDecimal("75.00"), "Food", LocalDate.now(), "Updated notes");
        ExpenseResponse updated = expenseService.updateExpense(1L, updateRequest);

        assertNotNull(updated);
        verify(expenseRepository, times(1)).save(testExpense);
    }

    @Test
    void testDeleteExpense_Success() {
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(testExpense));
        doNothing().when(expenseRepository).delete(testExpense);

        assertDoesNotThrow(() -> expenseService.deleteExpense(1L));
        verify(expenseRepository, times(1)).delete(testExpense);
    }

    @Test
    void testGetSummary() {
        Expense e1 = new Expense("Coffee", new BigDecimal("5.00"), "Food", LocalDate.now(), null);
        Expense e2 = new Expense("Taxi", new BigDecimal("25.00"), "Travel", LocalDate.now(), null);
        Expense e3 = new Expense("Lunch", new BigDecimal("20.00"), "Food", LocalDate.now(), null);

        when(expenseRepository.findAll()).thenReturn(Arrays.asList(e1, e2, e3));

        ExpenseSummaryResponse summary = expenseService.getSummary();

        assertNotNull(summary);
        assertEquals(new BigDecimal("50.00"), summary.getTotalAmount());
        assertEquals(3, summary.getTotalCount());
        assertFalse(summary.getCategoryBreakdowns().isEmpty());
    }
}

