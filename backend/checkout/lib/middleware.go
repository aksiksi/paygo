package lib

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type LoggingMiddleware struct {
	logger *log.Logger
}

func NewLoggingMiddleware(logger *log.Logger) *LoggingMiddleware {
	return &LoggingMiddleware{
		logger,
	}
}

func (m *LoggingMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(resp http.ResponseWriter, req *http.Request) {
		id := mux.Vars(req)["id"]
		if id == "" {
			id = "N/A"
		}

		m.logger.Printf(
			"path:%s,method:%s,size:%d,content_type:%s,request_id:%s",
			req.RequestURI, req.Method, req.ContentLength, req.Header.Get("Content-Type"), id,
		)

		next.ServeHTTP(resp, req)
	})
}

type authContext struct{}

type AuthMiddleware struct {
	logger  *log.Logger
	apiKeys map[string]bool
}

func NewAuthMiddleware(logger *log.Logger) *AuthMiddleware {
	apiKeys := make(map[string]bool)
	apiKeys["test123"] = true

	return &AuthMiddleware{
		logger,
		apiKeys,
	}
}

func (m *AuthMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(resp http.ResponseWriter, req *http.Request) {
		apiKey := req.Header.Get("X-Api-Key")
		if apiKey == "" {
			http.Error(resp, "X-Api-Key header not set", http.StatusBadRequest)
			return
		}

		if _, ok := m.apiKeys[apiKey]; !ok {
			http.Error(resp, fmt.Sprintf("X-Api-Key is invalid: %s", apiKey), http.StatusUnauthorized)
			return
		}

		userId := apiKey + "-user"
		ctx := context.WithValue(req.Context(), &authContext{}, userId)
		req = req.WithContext(ctx)

		next.ServeHTTP(resp, req)
	})
}

func CacheControlMiddleware(h http.Handler, value string) http.Handler {
	return http.HandlerFunc(func(resp http.ResponseWriter, req *http.Request) {
		resp.Header().Set("Cache-Control", value)
		h.ServeHTTP(resp, req)
	})
}
