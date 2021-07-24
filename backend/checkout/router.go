package main

import (
	"log"
	"net/http"

	"github.com/aksiksi/paygo/checkout/api"
	"github.com/aksiksi/paygo/checkout/app"
	"github.com/gorilla/mux"
)

func NewRouter(logger *log.Logger) *mux.Router {
	router := mux.NewRouter()

	api.AttachApiRouter("/api/v1", logger, router)
	app.AttachCheckoutRouter("/checkout", logger, router)

	// Serve app files
	fs := http.FileServer(http.Dir("./www"))
	router.PathPrefix("/").Handler(fs)

	return router
}
