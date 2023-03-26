package models

type Product struct {
	ID          int    				`json:"id" gorm:"primary_key:auto_increment"`
	PartnerID   int                 `json:"partner_id"`
    Partner     UserProfileResponse	`json:"-" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Name        string 				`json:"name" gorm:"type: varchar(255)"`
	Price       int    				`json:"price" gorm:"type: int"`
	Image       string 				`json:"image" gorm:"type: varchar(255)"`
}