package productsdto

type CreateProductRequest struct {
	PartnerID   int    `json:"partner_id"`
	Name        string `json:"name" form:"name"`
	Price       int    `json:"price" form:"price"`
	Image       string `json:"image" form:"image"`
}

type UpdateProductRequest struct {
	Name        string `json:"name" form:"name"`
	Price       int    `json:"price" form:"price"`
	Image       string `json:"image" form:"image"`
}

type ProductResponse struct {
	ID          int    `json:"id"`
	PartnerID   int    `json:"partner_id"`
	Name        string `json:"name" form:"name"`
	Price       int    `json:"price" form:"price"`
	Image       string `json:"image" form:"image"`
}