package main

import (
	"context"
	"fmt"
	"log"
	"mapfox/server/internal/models"
	"os"
	"strings"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

// CustomLogger captures SQL statements
type CustomLogger struct {
	sqlStatements []string
}

func (cl *CustomLogger) LogMode(level logger.LogLevel) logger.Interface {
	return cl
}

func (cl *CustomLogger) Info(ctx context.Context, msg string, data ...interface{}) {
	// Capture SQL statements
	if strings.Contains(msg, "SELECT") || strings.Contains(msg, "CREATE") || strings.Contains(msg, "ALTER") || strings.Contains(msg, "DROP") {
		sql := fmt.Sprintf(msg, data...)
		cl.sqlStatements = append(cl.sqlStatements, sql)
	}
}

func (cl *CustomLogger) Warn(ctx context.Context, msg string, data ...interface{}) {
	cl.Info(ctx, msg, data...)
}

func (cl *CustomLogger) Error(ctx context.Context, msg string, data ...interface{}) {
	// Ignore connection errors
}

func (cl *CustomLogger) Trace(ctx context.Context, begin time.Time, fc func() (string, int64), err error) {
	// Capture SQL from trace
	sql, _ := fc()
	if sql != "" && strings.Contains(sql, "CREATE TABLE") {
		cl.sqlStatements = append(cl.sqlStatements, sql)
	}
}

func main() {
	// Create custom logger to capture SQL
	customLogger := &CustomLogger{sqlStatements: make([]string, 0)}

	// Use PostgreSQL driver with DryRun mode
	// DryRun generates SQL without executing queries, so connection doesn't need to succeed
	dsn := "host=localhost user=postgres password=postgres dbname=postgres port=5432 sslmode=disable"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			SingularTable: false,
		},
		DryRun: true, // 👉 generates SQL, doesn't execute it
		Logger: customLogger,
	})

	// Even if connection fails, DryRun mode still allows SQL generation
	// We can proceed with the migration regardless
	if db == nil {
		log.Fatalf("Failed to initialize GORM: %v", err)
	}

	// Generate migration file with timestamp
	timestamp := time.Now().Format("20060102150405")
	filename := fmt.Sprintf("tmps/migrations/%s_auto_migration.sql", timestamp)

	// Create directory if not exists
	if err := os.MkdirAll("tmps/migrations", os.ModePerm); err != nil {
		log.Fatalf("Failed to create migrations directory: %v", err)
	}

	f, err := os.Create(filename)
	if err != nil {
		log.Fatalf("Failed to create migration file: %v", err)
	}
	defer f.Close()

	// Migrate models - GORM will generate SQL in DryRun mode
	// Even if connection fails, DryRun still generates the SQL
	// Replace with your models as needed
	db.AutoMigrate(
		&models.TestTable{},
		// Add more models here
	)

	// Collect all SQL statements from custom logger
	var sqlBuilder strings.Builder

	// Write captured SQL statements
	for _, sql := range customLogger.sqlStatements {
		if sql != "" {
			sqlBuilder.WriteString(sql)
			sqlBuilder.WriteString(";\n")
		}
	}

	sqlString := sqlBuilder.String()
	if _, err := f.WriteString(sqlString); err != nil {
		log.Fatalf("Failed to write migration SQL: %v", err)
	}

	fmt.Printf("✅ Migration file generated: %s\n", filename)
	if sqlString != "" {
		fmt.Printf("📝 SQL:\n%s\n", sqlString)
	} else {
		fmt.Println("⚠️  No SQL generated. Check your models and database configuration.")
	}
}
