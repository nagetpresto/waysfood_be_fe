package models

type Transaction struct {
    ID         int                   `json:"id"`
    UserID     int                   `json:"-"`
    User       UserProfileResponse   `json:"user" gorm:"constraint:OnUpdate:CASCADE;OnDelete:CASCADE;"`
    PartnerID  int                   `json:"partner_id"`
    Partner    UserProfileResponse   `json:"-" gorm:"constraint:OnUpdate:CASCADE;OnDelete:CASCADE;"`
    Day        string                `json:"day" gorm:"type: varchar(255)"`
    Date       string                `json:"date" gorm:"type: varchar(255)"`
    Status     string                `json:"status" gorm:"type: varchar(255)"`
    Location   string                `json:"location" gorm:"type: varchar(255)"`
    Distance float64 `json:"distance" gorm:"type:float"`
    Fee         int                   `json:"deliv_fee" gorm:"type: int(55)"`
    Cart       []Cart                `json:"cart" gorm:"constraint:OnDelete:SET NULL;"`
}