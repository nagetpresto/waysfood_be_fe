package repositories

import (
	"BE/models"

	"gorm.io/gorm"
)

type AuthRepository interface {
	Register(user models.User) (models.User, error)
	GetUserByEmail(email string) (models.User, error)
	Login(email string) (models.User, error)
	GetActiveUser(ID int) (models.User, error)
	UpdateActiveUser(user models.User) (models.User, error)
	ConfirmEmail(user models.User) (models.User, error)
	GetUserByCode(code string) (models.User, error)
}

func RepositoryAuth(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) Register(user models.User) (models.User, error) {
	err := r.db.Create(&user).Error

	return user, err
}

func (r *repository) GetUserByEmail(email string) (models.User, error) {
	var user models.User
	err := r.db.Preload("Transaction").Preload("Transaction.User").Preload("Transaction.Cart").Preload("Transaction.Cart.Product").First(&user, "email=?", email).Error // add this code
	return user, err
}

func (r *repository) Login(email string) (models.User, error) {
	var user models.User
	err := r.db.First(&user, "email=?", email).Error

	return user, err
}

func (r *repository) GetActiveUser(ID int) (models.User, error) {
	var user models.User
	err := r.db.Preload("Transaction").Preload("Transaction.User").Preload("Transaction.Cart").Preload("Transaction.Cart.Product").Where("id = ?", ID).First(&user, ID).Error 

	return user, err
}

func (r *repository) UpdateActiveUser(user models.User) (models.User, error) {
	err := r.db.Save(&user).Error

	return user, err
}

func (r *repository) ConfirmEmail(user models.User) (models.User, error) {
	err := r.db.Save(&user).Error
	return user, err
}

func (r *repository) GetUserByCode(code string) (models.User, error) {
	var user models.User
	err := r.db.First(&user, "confirm_code=?", code).Error
	return user, err
}