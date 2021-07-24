package main

import (
	"log"

	"github.com/aksiksi/paygo/checkout/api"
	"github.com/aksiksi/paygo/checkout/app"
	"github.com/gorilla/mux"
)

func NewRouter(logger *log.Logger) *mux.Router {
	router := mux.NewRouter()

	api.AttachApiRouter("/api/v1", logger, router)
	app.AttachCheckoutRouter("/checkout", logger, router)

	return router
}
