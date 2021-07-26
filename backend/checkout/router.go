package main

import (
	"github.com/aksiksi/paygo/checkout/api"
	"github.com/aksiksi/paygo/checkout/app"
	"github.com/gorilla/mux"
	"go.uber.org/zap"
)

func NewRouter(logger *zap.SugaredLogger) *mux.Router {
	router := mux.NewRouter()

	api.AttachApiRouter("/api/v1", logger, router)
	app.AttachCheckoutRouter("/checkout", logger, router)

	return router
}
