package com.expensetracker.config;

import com.expensetracker.model.Category;
import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    private final ExpenseRepository expenseRepository;

    public DataInitializer(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Override
    public void run(String... args) {
        if (expenseRepository.count() == 0) {
            logger.info("Database is empty. Seeding initial sample expenses...");

            Expense e1 = new Expense(
                    "Grocery Shopping at Whole Foods",
                    new BigDecimal("84.50"),
                    Category.FOOD.getDisplayName(),
                    LocalDate.now().minusDays(1),
                    "Weekly fruits, vegetables, and milk"
            );

            Expense e2 = new Expense(
                    "Uber Ride to Airport",
                    new BigDecimal("42.00"),
                    Category.TRAVEL.getDisplayName(),
                    LocalDate.now().minusDays(2),
                    "Morning cab ride for business trip"
            );

            Expense e3 = new Expense(
                    "Running Shoes & Gym Apparel",
                    new BigDecimal("129.99"),
                    Category.SHOPPING.getDisplayName(),
                    LocalDate.now().minusDays(4),
                    "Nike trail running sneakers"
            );

            Expense e4 = new Expense(
                    "Monthly High-Speed Internet Bill",
                    new BigDecimal("65.00"),
                    Category.UTILITIES.getDisplayName(),
                    LocalDate.now().minusDays(6),
                    "Fiber optics home internet broadband"
            );

            Expense e5 = new Expense(
                    "Dinner with Friends",
                    new BigDecimal("56.75"),
                    Category.FOOD.getDisplayName(),
                    LocalDate.now().minusDays(7),
                    "Italian bistro dinner"
            );

            Expense e6 = new Expense(
                    "Software Subscription",
                    new BigDecimal("15.00"),
                    Category.OTHER.getDisplayName(),
                    LocalDate.now().minusDays(9),
                    "Cloud storage and backup tools"
            );

            expenseRepository.saveAll(Arrays.asList(e1, e2, e3, e4, e5, e6));
            logger.info("Successfully seeded 6 initial expenses.");
        } else {
            logger.info("Database already contains {} expenses. Skipping seed.", expenseRepository.count());
        }
    }
}

