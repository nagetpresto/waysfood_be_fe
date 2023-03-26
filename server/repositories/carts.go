package repositories

import (
	"BE/models"

	"gorm.io/gorm"
)

type CartRepository interface {
	FindCarts() ([]models.Cart, error)
	GetCart(ID int) (models.Cart, error)
	CreateCart(Cart models.Cart) (models.Cart, error)
	GetActiveProduct(UserID int, TransID int, ProductID int) (models.Cart, error)
	GetProd(ID int) (models.Product, error)

	GetActiveTrans(UserID int) (models.Transaction, error)
	CreateTransaction(transaction models.Transaction) (models.Transaction, error)
	GetActiveCart(TransID int) ([]models.Cart, error)
	DeleteActiveCart(TransID int) ([]models.Cart, error)

	UpdateCart(Cart models.Cart, ID int) (models.Cart, error)
	DeleteCart(Cart models.Cart, ID int) (models.Cart, error)
}

func RepositoryCart(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) FindCarts() ([]models.Cart, error) {
	var cart []models.Cart
	err := r.db.Preload("User").Preload("Product").Preload("Product").Preload("Partner").Find(&cart).Error

	return cart, err
}

func (r *repository) GetCart(ID int) (models.Cart, error) {
	var cart models.Cart
	err := r.db.Preload("User").Preload("Product").Preload("Product").Preload("Partner").First(&cart, ID).Error

	return cart, err
}

func (r *repository) GetActiveTrans(UserID int) (models.Transaction, error) {
	var transaction models.Transaction
	err := r.db.Preload("User").Preload("Cart").Preload("Cart.Product").Preload("Cart.Product").Preload("Cart.Partner").Where("user_id = ? AND status = ?", UserID, "active").First(&transaction).Error
	return transaction, err
}

func (r *repository) CreateTransaction(transaction models.Transaction) (models.Transaction, error) {
	err := r.db.Create(&transaction).Error
	return transaction, err
}

func (r *repository) CreateCart(cart models.Cart) (models.Cart, error) {
	err := r.db.Create(&cart).Error
	return cart, err
}

func (r *repository) GetActiveProduct(UserID int, TransID int,ProductID int) (models.Cart, error) {
	var cart models.Cart
	err := r.db.Preload("User").Preload("Product").Preload("Partner").Where("user_id = ? AND transaction_id = ? AND product_id = ?", UserID, TransID, ProductID).First(&cart).Error
	return cart, err
}

func (r *repository) DeleteCart(cart models.Cart, ID int) (models.Cart, error) {
	err := r.db.Delete(&cart).Error

	return cart, err
}

func (r *repository) DeleteActiveCart(TransID int) ([]models.Cart, error) {
	var cart []models.Cart
	err := r.db.Delete(&cart, "transaction_id =?", TransID).Error

	return cart, err
}

func (r *repository) UpdateCart(Cart models.Cart, ID int) (models.Cart, error) {
	err := r.db.Save(&Cart).Error

	return Cart, err
}

func (r *repository) GetActiveCart(TransID int) ([]models.Cart, error) {
	var carts []models.Cart
	err := r.db.Preload("User").Preload("Product").Preload("Product").Preload("Partner").Find(&carts, "transaction_id = ?", TransID).Error

	return carts, err
}

func (r *repository) GetProd(ID int) (models.Product, error) {
	var product models.Product
	err := r.db.Where("id = ?", ID).First(&product).Error // add this code

	return product, err
}