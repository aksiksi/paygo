package checkout

import (
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

func (l *LoggingMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(resp http.ResponseWriter, req *http.Request) {
		id, exists := mux.Vars(req)["id"]
		if !exists {
			id = "N/A"
		}

		l.logger.Printf(
			"path:%s,method:%s,size:%d,content_type:%s,request_id:%s",
			req.RequestURI, req.Method, req.ContentLength, req.Header.Get("Content-Type"), id,
		)

		next.ServeHTTP(resp, req)
	})
}
