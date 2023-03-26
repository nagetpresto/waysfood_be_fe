package routes

import (
	"BE/handlers"
	"BE/pkg/mysql"
	"BE/repositories"
	"BE/pkg/middleware"

	"github.com/labstack/echo/v4"
)

func AuthRoutes(e *echo.Group) {
	authRepository := repositories.RepositoryAuth(mysql.DB)
	h := handlers.HandlerAuth(authRepository)

	e.POST("/register", h.Register)
	e.POST("/login", h.Login)
	e.GET("/profile", middleware.Auth(h.GetActiveUser))
	e.PATCH("/profile", middleware.Auth(middleware.UploadFile(h.UpdateActiveUser)))
	e.PATCH("/confirm-email/:code", h.ConfirmEmail)	
}