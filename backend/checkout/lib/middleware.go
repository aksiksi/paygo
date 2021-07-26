package lib

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"go.uber.org/zap"
)

type LoggingMiddleware struct {
	logger *zap.SugaredLogger
}

func NewLoggingMiddleware(logger *zap.SugaredLogger) *LoggingMiddleware {
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

		m.logger.Infow("got API request",
			"path", req.RequestURI,
			"method", req.Method,
			"size", req.ContentLength,
			"content_type", req.Header.Get("Content-Type"),
			"request_id", id,
		)

		next.ServeHTTP(resp, req)
	})
}

type authContext struct{}

type AuthMiddleware struct {
	logger  *zap.SugaredLogger
	apiKeys map[string]bool
}

func NewAuthMiddleware(logger *zap.SugaredLogger) *AuthMiddleware {
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
