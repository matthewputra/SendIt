package handlers

import (
	"github.com/matthewputra/SendIt/servers/gateway/models/users"
	"github.com/matthewputra/SendIt/servers/gateway/sessions"
)

// HandlerContext stores information about signing key,
// session store and user store.
type HandlerContext struct {
	SigningKey   string
	SessionStore sessions.Store
	UserStore    users.Store
}

// NewHandlerContext constructs a new HandlerContext, ensuring
// that the dependencies are valid values
func NewHandlerContext(signingKey string, sessionStore sessions.Store, userStore users.Store) *HandlerContext {
	if len(signingKey) == 0 {
		panic("Signing key has length 0")
	} else if sessionStore == nil {
		panic("Session Store is null")
	} else if userStore == nil {
		panic("User Store is null")
	} else {
		return &HandlerContext{signingKey, sessionStore, userStore}
	}
}
