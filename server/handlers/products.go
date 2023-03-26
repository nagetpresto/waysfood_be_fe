package handlers

import (
	productsdto "BE/dto/products"
	dto "BE/dto/result"
	"BE/models"
	"BE/repositories"
	"net/http"
	"strconv"
	"context"
	"os"
	"fmt"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

// var ctx = context.Background()
// var CLOUD_NAME = os.Getenv("CLOUD_NAME")
// var API_KEY = "823725867286355"
// var API_SECRET = "fSWh1G7esyFPamIVVJU9dJfM3vU"

type handlerProduct struct {
	ProductRepository repositories.ProductRepository
}

func HandlerProduct(ProductRepository repositories.ProductRepository) *handlerProduct {
	return &handlerProduct{ProductRepository}
}

func (h *handlerProduct) FindProducts(c echo.Context) error {
	products, err := h.ProductRepository.FindProducts()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}
	fmt.Println("1"+os.Getenv("CLOUD_NAME"))
	fmt.Println("2"+os.Getenv("API_KEY"))
	fmt.Println("3"+os.Getenv("API_SECRET"))

	// var CLOUD = os.Getenv("CLOUD_NAME")
	// fmt.Println("1"+CLOUD_NAME)
	// fmt.Println("1"+CLOUD)
	// fmt.Println("2"+API_KEY)
	// fmt.Println("3"+API_SECRET)
	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: products})
}

func (h *handlerProduct) GetProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	var product models.Product
	product, err := h.ProductRepository.GetProduct(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: product})
}

func (h *handlerProduct) FindPartners(c echo.Context) error {
	Role := "partner"
	partners, err := h.ProductRepository.FindPartners(Role)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: partners})
}

func (h *handlerProduct) UpdatePartnersDistance(c echo.Context) error {
    location := (c.Param("location"))

    err := h.ProductRepository.UpdatePartnersDistance(location)
    if err != nil {
        return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
    }

    return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: ""})
}

func (h *handlerProduct) GetProductbyPartner(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	products, err := h.ProductRepository.GetProductbyPartner(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: products})
}

func (h *handlerProduct) CreateProduct(c echo.Context) error {
	request := new(productsdto.CreateProductRequest)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	userLogin := c.Get("userLogin")
	partnerId := userLogin.(jwt.MapClaims)["id"].(float64)

	var ctx = context.Background()
	var CLOUD_NAME = os.Getenv("CLOUD_NAME")
	var API_KEY = os.Getenv("API_KEY")
	var API_SECRET = os.Getenv("API_SECRET")

	// get from middleware
	dataFile := c.Get("dataFile").(string)
	ImageCloud := ""
	if dataFile != "" {
		// Configuration
		cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)
		// Upload file to Cloudinary ...
		resp, err := cld.Upload.Upload(ctx, dataFile, uploader.UploadParams{Folder: "WaysBeans"});
		if err != nil {
		fmt.Println(err.Error())
		}
		ImageCloud =  resp.SecureURL

	}else{
		ImageCloud =  ""
	}

	product := models.Product{
		PartnerID:   int(partnerId),
		Name:   request.Name,
		Price:  request.Price,
		Image:  ImageCloud,
	}

	product, err = h.ProductRepository.CreateProduct(product)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	product, _ = h.ProductRepository.GetProduct(product.ID)

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseProduct(product)})
}

func (h *handlerProduct) UpdateProduct(c echo.Context) error {
	request := new(productsdto.UpdateProductRequest)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}
	
	id, _ := strconv.Atoi(c.Param("id"))

	product, err := h.ProductRepository.GetProduct(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	if request.Name != "" {
		product.Name = request.Name
	}

	if request.Price != 0 {
		product.Price = request.Price
	}

	var ctx = context.Background()
	var CLOUD_NAME = os.Getenv("CLOUD_NAME")
	var API_KEY = os.Getenv("API_KEY")
	var API_SECRET = os.Getenv("API_SECRET")

	// get from middleware
	dataFile := c.Get("dataFile").(string)
	if dataFile != "" {
		// Configuration
		cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)
		// Upload file to Cloudinary ...
		resp, err := cld.Upload.Upload(ctx, dataFile, uploader.UploadParams{Folder: "WaysBeans"});
		if err != nil {
		fmt.Println(err.Error())
		}
		product.Image =  resp.SecureURL

	}

	data, err := h.ProductRepository.UpdateProduct(product)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseProduct(data)})
}

func (h *handlerProduct) DeleteProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	product, err := h.ProductRepository.GetProduct(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	data, err := h.ProductRepository.DeleteProduct(product, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseProduct(data)})
}

func convertResponseProduct(u models.Product) models.Product {
	return models.Product{
		ID:   	u.ID,
		PartnerID: u.PartnerID,
		Partner: u.Partner,
		Name:   u.Name,
		Price:  u.Price,
		Image:  u.Image,
	}
}