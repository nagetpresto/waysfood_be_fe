package models

type Cart struct {
    ID             int                  `json:"id" gorm:"primary_key:auto_increment"`
    UserID         int                  `json:"user_id"`
    User           UserProfileResponse  `json:"-" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
    PartnerID      int                  `json:"partner_id"`
    Partner     UserProfileResponse	`json:"partner" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
    ProductID      int                  `json:"-" gorm:"type: int"`
    Product        Product              `json:"product" gorm:"constraint:OnDelete:SET NULL;"`
    Qty            int                  `json:"qty" gorm:"type: int"`
    Amount         int                  `json:"amount" gorm:"type: int"`
    TransactionID  int                  `json:"trans_id" gorm:"type: int"`
    Transaction    Transaction          `json:"-"`
}