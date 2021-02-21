package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/aksiksi/paygo/handlers"
	"github.com/gorilla/mux"
)

func main() {
	port, ok := os.LookupEnv("PAYGO_PORT")
	if !ok {
		port = "9000"
	}

	logger := log.New(os.Stdout, "paygo ", log.LstdFlags)

	ph := handlers.NewPayment(logger)

	mux := mux.NewRouter()

	getRouter := mux.Methods(http.MethodGet).Subrouter()

	getRouter.HandleFunc("/v1/payment/{id}", ph.GetPayment)
	getRouter.HandleFunc("/v1/payment/{id}/", ph.GetPayment)

	postRouter := mux.Methods(http.MethodPost).Subrouter()
	postRouter.HandleFunc("/v1/payment", ph.PostPayment)
	postRouter.HandleFunc("/v1/payment/", ph.PostPayment)

	server := http.Server{
		Addr:         ":" + port,
		Handler:      mux,
		ErrorLog:     logger,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	go func() {
		logger.Printf("Starting server on port %s\n", port)

		err := server.ListenAndServe()
		if err != nil {
			logger.Fatalf("Error starting server: %s\n", err)
			os.Exit(1)
		}
	}()

	// Trap sigterm or interupt and gracefully shutdown the server
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	signal.Notify(c, os.Kill)

	// Block until a signal is received.
	<-c

	// Gracefully shutdown the server, waiting max 30 seconds for current operations to complete
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	server.Shutdown(ctx)
}
