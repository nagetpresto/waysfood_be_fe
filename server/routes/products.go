package routes

import (
	"BE/handlers"
	"BE/pkg/mysql"
	"BE/repositories"
	"BE/pkg/middleware"

	"github.com/labstack/echo/v4"
)


func ProductRoutes(e *echo.Group) {
	productRepository := repositories.RepositoryProduct(mysql.DB)
	h := handlers.HandlerProduct(productRepository)

	e.GET("/products", (h.FindProducts))
	e.GET("/products/:id", (h.GetProduct))
	e.GET("/partners", (h.FindPartners))
	e.GET("/products/partners/:id", (h.GetProductbyPartner))
	e.PATCH("/partners/:location", (h.UpdatePartnersDistance))
	e.POST("/products", middleware.PartnerOnly(middleware.UploadFile(h.CreateProduct)))
	e.PATCH("/products/:id", middleware.PartnerOnly(middleware.UploadFile(h.UpdateProduct)))
	e.DELETE("/products/:id", middleware.PartnerOnly(h.DeleteProduct))
}