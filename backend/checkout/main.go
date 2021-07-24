package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gorilla/mux"

	checkout "github.com/aksiksi/paygo/checkout/lib"

	_ "github.com/Rhymond/go-money"
)

var port = flag.Int("port", 9000, "port to listen on")
var addr = flag.String("addr", "", "address to listen on")

func main() {
	flag.Parse()

	logger := log.New(os.Stdout, "paygo-checkout ", log.LstdFlags)
	router := mux.NewRouter()

	// API router
	apiRouter := router.PathPrefix("/api/v1").Subrouter()
	ph := checkout.NewPaymentHandler(logger)
	ch := checkout.NewChargeHandler(logger)

	apiGet := apiRouter.Methods(http.MethodGet).Subrouter()
	apiGet.HandleFunc("/payment/{id}", ph.GetPayment)
	apiGet.HandleFunc("/charge/{id}", ch.GetCharge)

	apiPost := apiRouter.Methods(http.MethodPost).Subrouter()
	apiPost.HandleFunc("/payment", ph.AddPayment)
	apiPost.HandleFunc("/charge", ch.AddCharge)

	apiDelete := apiRouter.Methods(http.MethodDelete).Subrouter()
	apiDelete.HandleFunc("/payment", ph.DeletePayment)
	apiDelete.HandleFunc("/charge", ch.DeleteCharge)

	loggingMiddleware := checkout.NewLoggingMiddleware(logger)
	authMiddleware := checkout.NewAuthMiddleware(logger)

	apiRouter.Use(loggingMiddleware.Middleware)
	apiRouter.Use(authMiddleware.Middleware)

	// Checkout router
	// checkoutRouter := router.PathPrefix("/checkout").Subrouter()

	addr := fmt.Sprintf("%s:%d", *addr, *port)
	server := http.Server{
		Addr:         addr,
		Handler:      router,
		ErrorLog:     logger,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	go func() {
		logger.Printf("Starting server on: \"%s\"\n", addr)

		err := server.ListenAndServe()
		if err != nil {
			logger.Fatalf("Error starting server: %s\n", err)
			os.Exit(1)
		}
	}()

	// Trap sigterm or interupt and gracefully shutdown the server
	c := make(chan os.Signal, 1)
	signal.Notify(c, syscall.SIGINT)
	signal.Notify(c, syscall.SIGTERM)

	// Block until a signal is received.
	<-c

	// Gracefully shutdown the server, waiting max 30 seconds for current operations to complete
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	server.Shutdown(ctx)
}
