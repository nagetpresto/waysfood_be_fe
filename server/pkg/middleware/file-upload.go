package middleware

import (
	"io"
	"os"
	"net/http"

	"github.com/labstack/echo/v4"
)

func UploadFile(next echo.HandlerFunc) echo.HandlerFunc {
	//create context
	return func(c echo.Context) error {
		// get file from request
		file, err := c.FormFile("image")
		if err != nil {
			if err == http.ErrMissingFile {
				c.Set("dataFile", "")
				return next(c)
			}
			return c.JSON(http.StatusBadRequest, err)
		}

		// reads/opens file
		src, err := file.Open()
		if err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}
		defer src.Close() //defer function

		// create temp file and directory
		tempFile, err := os.CreateTemp("uploads", "image-*.png")
		if err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}
		defer tempFile.Close() //defer function

		// copy file to directory
		if _, err = io.Copy(tempFile, src); err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}

		data := tempFile.Name()

		c.Set("dataFile", data)
		return next(c)

		// // slicing name
		// data := tempFile.Name()
		// filename := data[8:]

		// // set value
		// c.Set("dataFile", filename)
		// return next(c)
	}
}
