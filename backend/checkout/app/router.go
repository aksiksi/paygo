package app

import (
	"log"

	"github.com/gorilla/mux"
)

func AttachCheckoutRouter(path string, _logger *log.Logger, router *mux.Router) *mux.Router {
	checkoutRouter := router.PathPrefix(path).Subrouter()
	return checkoutRouter
}
