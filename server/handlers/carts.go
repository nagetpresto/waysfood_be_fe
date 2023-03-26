package handlers

import (
	dto "BE/dto/result"
	cartsdto "BE/dto/carts"
	"BE/models"
	"BE/repositories"
	"net/http"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type handlerCart struct {
	CartRepository repositories.CartRepository
}

func HandlerCart(CartRepository repositories.CartRepository) *handlerCart {
	return &handlerCart{CartRepository}
}

func (h *handlerCart) FindCarts(c echo.Context) error {
	cart, err := h.CartRepository.FindCarts()
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: cart})
}

func (h *handlerCart) GetCart(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	cart, err := h.CartRepository.GetCart(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: cart})
}

func (h *handlerCart) GetActiveCart(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)

	trans, _ := h.CartRepository.GetActiveTrans(int(userId))
	cart, _ := h.CartRepository.GetActiveCart(int(trans.ID))

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: cart})
}

func (h *handlerCart) CreateCart(c echo.Context) error {
	request := new(cartsdto.CreateCartRequest)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	userLogin := c.Get("userLogin")
	userId := int(userLogin.(jwt.MapClaims)["id"].(float64))

	transaction, err := h.CartRepository.GetActiveTrans(userId)
	if err != nil {
		// If there is no active transaction, create a new one
		newTransaction := models.Transaction{
			ID:		int(time.Now().Unix()), //1678180770
			UserID: userId,
			PartnerID: request.PartnerID,
			Status: "active",
		}
		transaction, err = h.CartRepository.CreateTransaction(newTransaction)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
		}
	}

	prod, err := h.CartRepository.GetProd(request.ProductID)
		if err != nil {
			return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
		}

	activeProduct, err := h.CartRepository.GetActiveProduct(userId, transaction.ID, request.ProductID)
	if err != nil {
		// If there is no active cart, create the cart with the transaction ID obtained

		cart := models.Cart{
			UserID:        userId,
			PartnerID:     request.PartnerID,
			ProductID:     request.ProductID,
			Qty:           1,
			Amount:		   prod.Price,
			TransactionID: transaction.ID,
		}

		data, err := h.CartRepository.CreateCart(cart)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
		}

		return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseCart(data)})
	}

	activeProduct.Qty = 1 + activeProduct.Qty
	activeProduct.Amount = prod.Price * activeProduct.Qty

	data, err := h.CartRepository.UpdateCart(activeProduct, activeProduct.ID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseCart(data)})
}

func (h *handlerCart) UpdateCart(c echo.Context) error {
	request := new(cartsdto.UpdateCartRequest)
	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	id, _ := strconv.Atoi(c.Param("id"))

	cart, err := h.CartRepository.GetCart(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	if request.Qty != 0{
		cart.Qty = request.Qty
		cart.Amount = cart.Qty * cart.Product.Price
	}

	data, err := h.CartRepository.UpdateCart(cart,id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseCart(data)})
}

func (h *handlerCart) DeleteActiveCart(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)

	trans, _ := h.CartRepository.GetActiveTrans(int(userId))
	cart, _ := h.CartRepository.DeleteActiveCart(int(trans.ID))

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: cart})
}

func (h *handlerCart) DeleteCart(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	cart, err := h.CartRepository.GetCart(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	data, err := h.CartRepository.DeleteCart(cart, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseCart(data)})
}

func convertResponseCart(u models.Cart) cartsdto.CartResponse {
	return cartsdto.CartResponse{
		ID: 			u.ID,
		UserID: 		u.UserID,
		PartnerID:		u.PartnerID,
		Partner: 		u.Partner,
		ProductID: 		u.ProductID,
		Product: 		u.Product,
		Qty: 			u.Qty,
		Amount: 		u.Amount,
		TransactionID:	u.TransactionID,
	}
}