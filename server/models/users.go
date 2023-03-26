package models

type User struct {
	ID       		int    		`json:"id" gorm:"primary_key:auto_increment"`
	Name     		string 		`json:"name" gorm:"type: varchar(255)"`
	Email    		string 		`json:"email" gorm:"type: varchar(255)"`
	Password 		string 		`json:"password" gorm:"type: varchar(255)"`
	Image   		string 		`json:"image" gorm:"type: varchar(255)"`
	Gender 			string 		`json:"gender" gorm:"type: varchar(255)"`
	Phone 			string 		`json:"phone" gorm:"type: varchar(255)"`
	Location		string 		`json:"location" gorm:"type: varchar(255)"`
	Distance float64 `json:"distance" gorm:"type:float"`
	Role	 		string 		`json:"role" gorm:"type: varchar(255)"`
	IsConfirmed		bool 		`gorm:"type:boolean" json:"is_confirmed"`
	ConfirmCode		string 		`gorm:"type: varchar(255)" json:"confirm_code"`
	Transaction   	[]Transaction `json:"transaction"`
}

type UserProfileResponse struct {
	ID    		int    	`json:"id"`
	Name  		string 	`json:"name"`
	Email 		string 	`json:"email"`
	Image 		string 	`json:"image"`
	Gender 		string 	`json:"gender"`
	Phone 		string 	`json:"phone"`
	Location 	string 	`json:"location"`
	Distance float64 `json:"distance" `
	Role	 	string 	`json:"role"`
	IsConfirmed	bool	`json:"is_confirmed"`
	ConfirmCode	string 	`json:"confirm_code"`
}

func (UserProfileResponse) TableName() string {
	return "users"
}