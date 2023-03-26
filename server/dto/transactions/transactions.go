package transactionsdto

type CreateTransactionRequest struct {
	ID			int		`json:"id"`
	UserID   	int    	`json:"user_id"`
	PartnerID   	int    	`json:"partner_id"`
	Status 	 	string 	`json:"status"`
	Location 	 	string 	`json:"location"`
	Distance float64 `json:"distance"`
	Fee 	int 	`json:"deliv_fee"`
}

type UpdateTransactionRequest struct {
	Status 	 	string 	`json:"status"`
}

type TransactionResponse struct {
	ID     		int    	`json:"id"`
	UserID   	int    	`json:"user_id"`
	PartnerID   	int    	`json:"partner_id"`
	Day  string 	`json:"day"`
	Date  string 	`json:"date"`
	Status 	 	string 	`json:"status"`
	Location 	 	string 	`json:"location"`
	Distance float64 `json:"distance"`
	Fee 	int 	`json:"deliv_fee"`
}