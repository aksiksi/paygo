package app

import (
	"embed"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

//go:embed public
var publicFs embed.FS

func AttachCheckoutRouter(path string, logger *log.Logger, router *mux.Router) *mux.Router {
	checkoutRouter := router.PathPrefix(path).Subrouter()

	checkoutHandler := NewCheckoutHandler(logger)

	// Handle all static files embedded within the binary
	fs := http.FileServer(http.FS(publicFs))
	checkoutRouter.PathPrefix("/static").Handler(fs)
	checkoutRouter.Path("/favicon.ico").Handler(fs)
	checkoutRouter.Path("/manifest.json").Handler(fs)
	checkoutRouter.Path("/asset-manifest.json").Handler(fs)
	checkoutRouter.Path("/robots.txt").Handler(fs)
	checkoutRouter.Path("/logo192.png").Handler(fs)
	checkoutRouter.Path("/logo512.png").Handler(fs)

	// Catch-all handler for the checkout index page
	checkoutRouter.HandleFunc("/", checkoutHandler.IndexPage)

	return checkoutRouter
}
