package com.expensetracker.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    private static final Logger logger = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:}")
    private String rawDatasourceUrl;

    @Value("${spring.datasource.username:}")
    private String rawUsername;

    @Value("${spring.datasource.password:}")
    private String rawPassword;

    @Value("${spring.datasource.driver-class-name:}")
    private String rawDriverClass;

    @Bean
    @Primary
    public DataSource dataSource() {
        // Check for common cloud provider database URL environment variables (Aiven, Render, Heroku)
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.trim().isEmpty()) {
            databaseUrl = System.getenv("AIVEN_DATABASE_URL");
        }
        if (databaseUrl == null || databaseUrl.trim().isEmpty()) {
            databaseUrl = rawDatasourceUrl;
        }

        HikariConfig config = new HikariConfig();

        // Check if database URL is provided in URI format (e.g. postgres://avnadmin:pass@host:port/defaultdb?sslmode=require)
        if (databaseUrl != null && (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://"))) {
            logger.info("Detected PostgreSQL URI format (Aiven / Render / Cloud). Converting to JDBC...");
            try {
                URI dbUri = new URI(databaseUrl);
                String userInfo = dbUri.getUserInfo();
                String username = rawUsername;
                String password = rawPassword;

                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    password = parts[1];
                }

                int port = dbUri.getPort() > 0 ? dbUri.getPort() : 5432;
                String path = dbUri.getPath();
                if (path != null && path.startsWith("/")) {
                    path = path.substring(1);
                }
                if (path == null || path.isEmpty()) {
                    path = "defaultdb";
                }

                String query = dbUri.getQuery();
                StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://")
                        .append(dbUri.getHost())
                        .append(":")
                        .append(port)
                        .append("/")
                        .append(path);

                if (query != null && !query.isEmpty()) {
                    jdbcUrl.append("?").append(query);
                } else {
                    // Default to sslmode=require for Aiven cloud database
                    jdbcUrl.append("?sslmode=require");
                }

                config.setJdbcUrl(jdbcUrl.toString());
                config.setUsername(username);
                config.setPassword(password);
                config.setDriverClassName("org.postgresql.Driver");
                logger.info("Configured PostgreSQL connection to host: {}:{} db: {}", dbUri.getHost(), port, path);
            } catch (Exception e) {
                logger.error("Failed to parse PostgreSQL URI: {}. Falling back to standard configuration.", e.getMessage());
                fallbackConfig(config);
            }
        } else if (databaseUrl != null && databaseUrl.startsWith("mysql://")) {
            logger.info("Detected MySQL URI format. Converting to JDBC...");
            try {
                URI dbUri = new URI(databaseUrl);
                String userInfo = dbUri.getUserInfo();
                String username = rawUsername;
                String password = rawPassword;

                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    password = parts[1];
                }

                int port = dbUri.getPort() > 0 ? dbUri.getPort() : 3306;
                String path = dbUri.getPath() != null && dbUri.getPath().startsWith("/")
                        ? dbUri.getPath().substring(1) : "defaultdb";

                String jdbcUrl = "jdbc:mysql://" + dbUri.getHost() + ":" + port + "/" + path + "?sslMode=REQUIRED";
                config.setJdbcUrl(jdbcUrl);
                config.setUsername(username);
                config.setPassword(password);
                config.setDriverClassName("com.mysql.cj.jdbc.Driver");
            } catch (Exception e) {
                fallbackConfig(config);
            }
        } else if (databaseUrl != null && databaseUrl.startsWith("jdbc:")) {
            logger.info("Using standard JDBC URL configuration.");
            config.setJdbcUrl(databaseUrl);
            config.setUsername(rawUsername);
            config.setPassword(rawPassword);
            if (rawDriverClass != null && !rawDriverClass.trim().isEmpty()) {
                config.setDriverClassName(rawDriverClass);
            }
        } else {
            logger.info("No external database URL detected. Using persistent local H2 file database.");
            fallbackConfig(config);
        }

        // Connection pool optimizations for cloud databases
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setIdleTimeout(300000); // 5 minutes
        config.setMaxLifetime(600000);  // 10 minutes
        config.setConnectionTimeout(30000); // 30 seconds

        return new HikariDataSource(config);
    }

    private void fallbackConfig(HikariConfig config) {
        config.setJdbcUrl("jdbc:h2:file:./data/expensedb;DB_CLOSE_ON_EXIT=FALSE;AUTO_RECONNECT=TRUE");
        config.setUsername("sa");
        config.setPassword("");
        config.setDriverClassName("org.h2.Driver");
    }
}

