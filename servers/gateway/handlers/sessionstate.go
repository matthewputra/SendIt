package handlers

import (
	"time"

	"github.com/matthewputra/SendIt/servers/gateway/models/users"
)

//define a session state struct for this web server
//see the assignment description for the fields you should include
//remember that other packages can only see exported fields!

// SessionState stores the start time and the user information
// for a given session
type SessionState struct {
	StartTime time.Time   `json:"start_time"`
	User      *users.User `json:"user"`
}
