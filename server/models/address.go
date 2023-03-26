package models

type Address struct {
    ID         int                   `json:"id"`
    UserID     int                   `json:"user_id"`
    User       UserProfileResponse   `json:"user" gorm:"constraint:OnUpdate:CASCADE;OnDelete:CASCADE;"`
    Address    string                `json:"address" gorm:"type: varchar(255)"`
}