package api

import (
	"errors"
	"net/http"
)

type internalError struct {
	err error
}

func (e *internalError) Error() string {
	return e.err.Error()
}

type userVisibleError struct {
	err error
}

func (e *userVisibleError) Error() string {
	return e.err.Error()
}

func getErrorMessage(err error, safe string) string {
	var e *userVisibleError
	if errors.As(err, &e) {
		return err.Error()
	} else {
		return safe
	}
}

func setHttpError(err error, safe string, code int, resp http.ResponseWriter) {
	msg := getErrorMessage(err, safe)
	http.Error(resp, msg, code)
}
