package com.expensetracker.repository;

import com.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findAllByOrderByDateDesc();

    List<Expense> findByCategoryIgnoreCaseOrderByDateDesc(String category);

    @Query("SELECT e FROM Expense e WHERE LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY e.date DESC")
    List<Expense> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT e FROM Expense e WHERE LOWER(e.category) = LOWER(:category) AND LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY e.date DESC")
    List<Expense> findByCategoryAndKeyword(@Param("category") String category, @Param("keyword") String keyword);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e")
    BigDecimal getTotalAmount();

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE LOWER(e.category) = LOWER(:category)")
    BigDecimal getTotalAmountByCategory(@Param("category") String category);

    @Query("SELECT DISTINCT e.category FROM Expense e ORDER BY e.category ASC")
    List<String> findDistinctCategories();
}
