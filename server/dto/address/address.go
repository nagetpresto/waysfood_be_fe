package addressdto

type CreateAddressRequest struct {
	ID         int                   `json:"id"`
    UserID     int                   `json:"user_id"`
    Address    string                `json:"address" gorm:"type: varchar(255)"`
}

type UpdateAddressRequest struct {
	Address    string	`json:"address"`
}

type AddressResponse struct {
	ID         int                   `json:"id"`
    UserID     int                   `json:"user_id"`
    Address    string                `json:"address"`
}