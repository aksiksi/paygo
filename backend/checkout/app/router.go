package app

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"

	"github.com/aksiksi/paygo/checkout/lib"
	"github.com/gorilla/mux"
)

//go:embed public
var publicFs embed.FS

func AttachStaticRouter(prefix string, router *mux.Router) {
	// Build a FS from content of "public/"
	subFs, err := fs.Sub(publicFs, "public")
	if err != nil {
		panic(err)
	}

	fs := http.StripPrefix(fmt.Sprintf("%s/", prefix), http.FileServer(http.FS(subFs)))

	// Handle all static files embedded within the binary
	router.PathPrefix("/static").Handler(lib.CacheControlMiddleware(fs, "max-age=31536000"))
	router.Path("/favicon.ico").Handler(fs)
	router.Path("/manifest.json").Handler(fs)
	router.Path("/asset-manifest.json").Handler(fs)
	router.Path("/robots.txt").Handler(fs)
	router.Path("/logo192.png").Handler(fs)
	router.Path("/logo512.png").Handler(fs)
}

func AttachCheckoutRouter(path string, logger *log.Logger, router *mux.Router) *mux.Router {
	checkoutRouter := router.PathPrefix(path).Subrouter()
	checkoutHandler := NewCheckoutHandler(logger)

	// Serve static content under "/checkout/static"
	AttachStaticRouter(path, checkoutRouter)

	// Catch-all handler for the checkout index page
	checkoutRouter.HandleFunc("", checkoutHandler.IndexPage)

	return checkoutRouter
}
