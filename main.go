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
	logger := log.New(os.Stdout, "paygo ", log.LstdFlags)

	ph := handlers.NewPayment(logger)

	mux := mux.NewRouter().StrictSlash(true)

	getRouter := mux.Methods(http.MethodGet).Subrouter()
	getRouter.HandleFunc("/v1/payment", ph.GetPayments)
	getRouter.HandleFunc("/v1/payment/{id}", ph.GetPayment)

	server := http.Server{
		Addr:         ":9000",
		Handler:      mux,
		ErrorLog:     logger,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	go func() {
		logger.Println("Starting server on port 9090")

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
