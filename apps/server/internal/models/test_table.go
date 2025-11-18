package models

import "time"

type TestTable struct {
	ID        uint      `gorm:"primaryKey;autoIncrement"`
	Name      string    `gorm:"type:text;not null"`
	CreatedAt time.Time `gorm:"type:timestamptz;default:CURRENT_TIMESTAMP"`
}

func (TestTable) TableName() string {
	return "test_table"
}
