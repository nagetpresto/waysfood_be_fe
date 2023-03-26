package cartsdto

import (
	"BE/models"
)

type CreateCartRequest struct {
	UserID    	  int `json:"user_id"`
	PartnerID     int `json:"partner_id"`
	ProductID     int `json:"product_id"`
	Qty           int `json:"qty"`
}

type UpdateCartRequest struct {
	Qty           int `json:"qty"`
}

type CartResponse struct {
	ID        	  int			 `json:"id"`
	UserID    	  int 			 `json:"user_id"`
	PartnerID     int 			 `json:"partner_id"`
	Partner       models.UserProfileResponse `json:"partner"`
	ProductID     int            `json:"-"`
	Product       models.Product `json:"product"`
	Qty           int            `json:"qty"`
	Amount        int            `json:"amount"`
	TransactionID int            `json:"transaction_id"`
}