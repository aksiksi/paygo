package api

import (
	"log"
	"net/http"

	"github.com/aksiksi/paygo/checkout/lib"
	"github.com/gorilla/mux"
)

func AttachApiRouter(path string, logger *log.Logger, router *mux.Router) {
	ph := NewPaymentHandler(logger)
	ch := NewChargeHandler(logger)

	apiRouter := router.PathPrefix(path).Subrouter()

	apiGet := apiRouter.Methods(http.MethodGet).Subrouter()
	apiGet.HandleFunc("/payment/{id}", ph.GetPayment)
	apiGet.HandleFunc("/charge/{id}", ch.GetCharge)

	apiPost := apiRouter.Methods(http.MethodPost).Subrouter()
	apiPost.HandleFunc("/payment", ph.AddPayment)
	apiPost.HandleFunc("/charge", ch.AddCharge)

	apiDelete := apiRouter.Methods(http.MethodDelete).Subrouter()
	apiDelete.HandleFunc("/payment", ph.DeletePayment)
	apiDelete.HandleFunc("/charge", ch.DeleteCharge)

	loggingMiddleware := lib.NewLoggingMiddleware(logger)
	authMiddleware := lib.NewAuthMiddleware(logger)

	apiRouter.Use(loggingMiddleware.Middleware)
	apiRouter.Use(authMiddleware.Middleware)
}
