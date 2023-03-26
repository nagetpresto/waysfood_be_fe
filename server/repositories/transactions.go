package repositories

import (
	"BE/models"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	FindTransactions() ([]models.Transaction, error)
	GetTransaction(ID int) (models.Transaction, error)
	GetUserTrans(UserID int) ([]models.Transaction, error)
	GetPartnerTrans(UserID int) ([]models.Transaction, error)

	GetActiveTransaction(UserID int) (models.Transaction, error)
	DoTransaction(transaction models.Transaction, ID int) (models.Transaction, error)
	UpdateStatsTransaction(status string, ID int) error

	UpdateTransaction(transaction models.Transaction, ID int) (models.Transaction, error)
	DeleteTransaction(transaction models.Transaction, ID int) (models.Transaction, error)
}

func RepositoryTransaction(db *gorm.DB) *repository {
	return &repository{db}
}
func (r *repository) FindTransactions() ([]models.Transaction, error) {
	var transactions []models.Transaction
	err := r.db.Preload("User").Preload("Cart").Preload("Cart.Partner").Preload("Cart.Product").Find(&transactions, "status!=?", "active").Error
	return transactions, err
}

func (r *repository) GetTransaction(ID int) (models.Transaction, error) {
	var transaction models.Transaction
	err := r.db.Preload("User").Preload("Cart").Preload("Cart.Partner").Preload("Cart.Product").First(&transaction, ID).Error
	return transaction, err
}

func (r *repository) GetUserTrans(UserID int) ([]models.Transaction, error) {
	var transaction []models.Transaction
	err := r.db.Preload("User").Preload("Cart").Preload("Cart.Partner").Preload("Cart.Product").Where("user_id = ? AND status!=?", UserID, "active").Order("id desc").Find(&transaction).Error
	return transaction, err
}

func (r *repository) GetPartnerTrans(UserID int) ([]models.Transaction, error) {
	var transaction []models.Transaction
	err := r.db.Preload("User").Preload("Cart").Preload("Cart.Partner").Preload("Cart.Product").Where("partner_id = ? AND status!=?", UserID, "active").Order("id desc").Find(&transaction).Error
	return transaction, err
}

func (r *repository) GetActiveTransaction(UserID int) (models.Transaction, error) {
	var transaction models.Transaction
	err := r.db.Preload("User").Preload("Cart").Preload("Cart.Partner").Preload("Cart.Product").Where("user_id = ? AND status = ?", UserID, "active").First(&transaction).Error
	return transaction, err
}

func (r *repository) DoTransaction(transaction models.Transaction, ID int) (models.Transaction, error) {
	err := r.db.Save(&transaction).Error
	return transaction, err
}

func (r *repository) UpdateTransaction(transaction models.Transaction, ID int) (models.Transaction, error) {
	err := r.db.Save(&transaction).Error

	return transaction, err
}

func (r *repository) DeleteTransaction(transaction models.Transaction, ID int) (models.Transaction, error) {
	err := r.db.Delete(&transaction).Error

	return transaction, err
}

func (r *repository) UpdateStatsTransaction(status string, ID int) error {
	var transaction models.Transaction
	r.db.Preload("User").Preload("Cart").Preload("Cart.Partner").Preload("Cart.Product").First(&transaction, ID)

	if status != transaction.Status && status == "Success" {
		var product models.Product
		r.db.First(&product, transaction.ID)
		// for _, cart := range transaction.Cart {
        //     product := cart.Product
        //     product.Stock -= cart.Qty
        //     if err := r.db.Save(&product).Error; err != nil {
        //         return err
        //     }
        // }
	}

	transaction.Status = status

	err := r.db.Save(&transaction).Error

	return err
}