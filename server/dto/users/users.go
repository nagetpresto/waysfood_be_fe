package usersdto

type CreateUserRequest struct {
	Name     string `json:"name" form:"name"`
	Email    string `json:"email" form:"email"`
	Password string `json:"password" form:"password"`
	Image	 string `json:"image" form:"image"`
	Gender 			string 		`json:"gender"`
	Phone 			string 		`json:"phone"`
	Location		string 		`json:"location"`
	Role	 		string 		`json:"role"`
}

type UpdateUserRequest struct {
	Name     string `json:"name" form:"name"`
	Email    string `json:"email" form:"email"`
	Password string `json:"password" form:"password"`
	Image	 string `json:"image" form:"image"`
	Gender 			string 		`json:"gender"`
	Phone 			string 		`json:"phone"`
	Location		string 		`json:"location"`
}

type UserResponse struct {
	ID       int    `json:"Id" form:"id"`
	Name     string `json:"name" form:"name"`
	Email    string `json:"email" form:"email"`
	Password string `json:"password" form:"password"`
	Image	 string `json:"image" form:"image"`
	Gender 			string 		`json:"gender"`
	Phone 			string 		`json:"phone"`
	Location		string 		`json:"location"`
	Distance float64 `json:"distance"`
	Role	 		string 		`json:"role"`
	IsConfirmed	bool	`json:"is_confirmed"`
	ConfirmCode	string 	`json:"confirm_code"`
}