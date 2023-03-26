package repositories

import (
	"BE/models"
	"strings"
	"strconv"
	"math"

	"gorm.io/gorm"
)

type ProductRepository interface {
	FindProducts() ([]models.Product, error)
	GetProductbyPartner(ID int) ([]models.Product, error)
	FindPartners(Role string) ([]models.User, error)
	UpdatePartnersDistance(UserLocation string) error
	UpdatePartnerDistance(partnerID int, distance float64) error
	GetProduct(ID int) (models.Product, error)
	CreateProduct(product models.Product) (models.Product, error)
	UpdateProduct(user models.Product) (models.Product, error)
	DeleteProduct(user models.Product, ID int) (models.Product, error)
}

func RepositoryProduct(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) FindProducts() ([]models.Product, error) {
	var products []models.Product
	err := r.db.Preload("Partner").Find(&products).Error // add this code

	return products, err
}

func (r *repository) GetProduct(ID int) (models.Product, error) {
	var product models.Product
	err := r.db.Preload("Partner").First(&product, ID).Error // add this code

	return product, err
}

func (r *repository) FindPartners(Role string) ([]models.User, error) {
	var partners []models.User
	err := r.db.Order("distance ASC").Find(&partners, "role=?", Role).Error // add this code

	return partners, err
}

const R = 6371 // Radius of the earth in km

func calculateDistance(lat1, lon1, lat2, lon2 float64) float64 {
    dLat := deg2rad(lat2 - lat1)
    dLon := deg2rad(lon2 - lon1)
    a := math.Sin(dLat/2)*math.Sin(dLat/2) + math.Cos(deg2rad(lat1))*math.Cos(deg2rad(lat2))*math.Sin(dLon/2)*math.Sin(dLon/2)
    c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
    d := R * c // Distance in km
    return d
}

func deg2rad(deg float64) float64 {
    return deg * (math.Pi / 180)
}

func (r *repository) UpdatePartnersDistance(UserLocation string) error {
    partners, err := r.FindPartners("partner")
    if err != nil {
        return err
    }

    for _, p := range partners {
		location := strings.Split(p.Location, ",")
		partnerLat, _ := strconv.ParseFloat(location[1], 64)
		partnerLng, _ := strconv.ParseFloat(location[0], 64)

		location2 := strings.Split(UserLocation, ",")
		latitude, _ := strconv.ParseFloat(location2[1], 64)
		longitude, _ := strconv.ParseFloat(location2[0], 64)

        distance := calculateDistance(latitude, longitude, partnerLat, partnerLng)
        distance = math.Round(distance*100) / 100
		err = r.UpdatePartnerDistance(p.ID, distance)
        if err != nil {
            return err
        }
    }

    return nil
}

func (r *repository) UpdatePartnerDistance(partnerID int, distance float64) error {
    partner := &models.User{ID: partnerID}
    if err := r.db.First(&partner).Error; err != nil {
        return err
    }

    partner.Distance = distance

    if err := r.db.Save(&partner).Error; err != nil {
        return err
    }

    return nil
}

func (r *repository) GetProductbyPartner(ID int) ([]models.Product, error) {
	var products []models.Product
	err := r.db.Preload("Partner").Find(&products, "partner_id=?", ID).Error // add this code

	return products, err
}

func (r *repository) CreateProduct(product models.Product) (models.Product, error) {
	err := r.db.Create(&product).Error

	return product, err
}

func (r *repository) UpdateProduct(product models.Product) (models.Product, error) {
	err := r.db.Save(&product).Error

	return product, err
}

func (r *repository) DeleteProduct(product models.Product, ID int) (models.Product, error) {
	err := r.db.Delete(&product, ID).Scan(&product).Error

	return product, err
}