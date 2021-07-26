package main

import (
	"context"
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/aksiksi/paygo/checkout/lib"
	"go.uber.org/zap"
)

func main() {
	var port int
	var addr string

	flag.IntVar(&port, "port", 9000, "port to listen on")
	flag.StringVar(&addr, "addr", "", "address to listen on")
	flag.Parse()

	lib.Init()

	root, _ := zap.NewProduction()
	logger := root.Sugar()

	router := NewRouter(logger)

	host := fmt.Sprintf("%s:%d", addr, port)
	server := http.Server{
		Addr:         host,
		Handler:      router,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	go func() {
		logger.Infof("Starting server at %s", host)

		err := server.ListenAndServe()
		if err != nil {
			logger.Fatalf("Error starting server: %s\n", err)
			os.Exit(1)
		}
	}()

	// Trap sigterm or interrupt and gracefully shutdown the server
	c := make(chan os.Signal, 1)
	signal.Notify(c, syscall.SIGINT)
	signal.Notify(c, syscall.SIGTERM)

	// Block until a signal is received.
	<-c

	// Gracefully shutdown the server, waiting max 30 seconds for current operations to complete
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	server.Shutdown(ctx)
}
