package routes

import (
	"BE/handlers"
	"BE/pkg/mysql"
	"BE/repositories"

	"github.com/labstack/echo/v4"
)

func UserRoutes(e *echo.Group) {
	userRepository := repositories.RepositoryUser(mysql.DB)
	h := handlers.HandlerUser(userRepository)

	e.GET("/users", h.FindUsers)
	e.GET("/users/:id", h.GetUser)

	e.POST("/users", h.CreateUser)
	e.PATCH("/users/:id", h.UpdateUser)
	e.DELETE("/users/:id", h.DeleteUser)
}