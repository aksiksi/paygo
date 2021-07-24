package app

import (
	"html/template"
	"log"
	"net/http"
)

var indexTemplate = template.Must(template.ParseFS(publicFs, "index.html"))

type CheckoutHandler struct {
	logger *log.Logger
}

func NewCheckoutHandler(logger *log.Logger) *CheckoutHandler {
	return &CheckoutHandler{
		logger,
	}
}

func (h *CheckoutHandler) IndexPage(resp http.ResponseWriter, req *http.Request) {
	err := indexTemplate.Execute(resp, "test123")
	if err != nil {
		resp.WriteHeader(http.StatusInternalServerError)
		return
	}

	h.logger.Println("Rendered index.html")
}
