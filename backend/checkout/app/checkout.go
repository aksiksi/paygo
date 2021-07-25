package app

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"net/url"

	"github.com/aksiksi/paygo/checkout/lib"
	"github.com/go-playground/validator/v10"
)

var templates = template.Must(template.ParseFS(publicFs, "public/*.html"))

// Keep this in sync with `CheckoutProps` in frontend
type CheckoutParams struct {
	ClientId     string `json:"clientId" validate:"required"`
	StoreName    string `json:"storeName" validate:"required"`
	ProductName  string `json:"productName" validate:"required"`
	ProductPrice string `json:"productPrice" validate:"required"` // TODO(aksiksi): Pass this to JS as an int + currency
	SuccessUrl   string `json:"successUrl"`
	ErrorUrl     string `json:"errorUrl"`
}

func (c *CheckoutParams) Validate() error {
	return lib.Validator.Struct(c)
}

func NewCheckoutParamsFromQuery(queryParams url.Values) (*CheckoutParams, error) {
	clientId := queryParams.Get("clientId")
	storeName := queryParams.Get("storeName")
	productName := queryParams.Get("productName")
	productPrice := queryParams.Get("productPrice")
	successUrl := queryParams.Get("successUrl")
	errorUrl := queryParams.Get("errorUrl")

	checkoutParams := &CheckoutParams{
		ClientId:     clientId,
		StoreName:    storeName,
		ProductName:  productName,
		ProductPrice: productPrice,
		SuccessUrl:   successUrl,
		ErrorUrl:     errorUrl,
	}

	// Validate the values passed in using the query params
	if err := checkoutParams.Validate(); err != nil {
		validationErrors := err.(validator.ValidationErrors)
		for _, e := range validationErrors {
			return nil, fmt.Errorf("%s is a required query argument", e.Field())
		}
	}

	return checkoutParams, nil
}

type CheckoutHandler struct {
	logger *log.Logger
}

func NewCheckoutHandler(logger *log.Logger) *CheckoutHandler {
	return &CheckoutHandler{
		logger,
	}
}

func (h *CheckoutHandler) IndexPage(resp http.ResponseWriter, req *http.Request) {
	// Extract product info from request
	checkoutParams, err := NewCheckoutParamsFromQuery(req.URL.Query())
	if err != nil {
		resp.WriteHeader(http.StatusBadRequest)
		resp.Write([]byte(err.Error()))
		return
	}

	jsonBytes, _ := json.Marshal(checkoutParams)
	jsonString := string(jsonBytes)

	err = templates.ExecuteTemplate(resp, "index.html", jsonString)
	if err != nil {
		resp.WriteHeader(http.StatusInternalServerError)
		return
	}

	h.logger.Println("Rendered index.html")
}
