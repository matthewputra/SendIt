package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	"github.com/matthewputra/SendIt/servers/gateway/models/users"
	"github.com/matthewputra/SendIt/servers/gateway/sessions"
)

// NewCustomerHandler Handles POST: creating a new customer, taking JSON
func (ctx *HandlerContext) NewCustomerHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		// Check Content-Type is JSON
		if r.Header.Get("Content-Type") != "application/json" {
			// 415 Invalid Request Body
			http.Error(w, "Invalid request body", http.StatusUnsupportedMediaType)
		}

		// Create new user/customer
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			// 415
			http.Error(w, "Eror reading body into bytes", http.StatusUnsupportedMediaType)
		}
		createdUser := users.NewUser{}
		err = json.Unmarshal(body, &createdUser)
		if err != nil {
			// 415
			http.Error(w, "Error unmarshalling body", http.StatusUnsupportedMediaType)
		}

		// Validate new user
		validateErr := createdUser.Validate()
		if validateErr != nil {
			// 400
			http.Error(w, "Customer data is invalid", http.StatusBadRequest)
		}
		validatedUser, err := createdUser.ToUser()
		if err != nil {
			// 400
			http.Error(w, "Customer data is invalid", http.StatusBadRequest)
		}

		// Insert new user
		insertedUser, err := ctx.UserStore.Insert(validatedUser)
		if err != nil {
			// 500
			http.Error(w, "Internal server error", http.StatusInternalServerError)
		}

		// Begin Session
		ctx.newSession(insertedUser, w)
		validUser, _ := ctx.UserStore.GetByID(insertedUser.ID)
		validUserJSON, _ := json.Marshal(validUser)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		w.Write(validUserJSON)

	} else {
		http.Error(w, "Must be a POST request method", http.StatusMethodNotAllowed)
	}
}

// Handles POST: Create new driver, takes JSON
func (ctx *HandlerContext) NewDriverHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		// Check Content-Type is JSON
		if r.Header.Get("Content-Type") != "application/json" {
			// 415 Invalid Request Body
			http.Error(w, "Invalid request body", http.StatusUnsupportedMediaType)
		}

		// Creates new driver
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			// 415
			http.Error(w, "Eror reading body into bytes", http.StatusUnsupportedMediaType)
		}
		createdUser := users.NewUser{}
		err = json.Unmarshal(body, &createdUser)
		if err != nil {
			// 415
			http.Error(w, "Error unmarshalling body", http.StatusUnsupportedMediaType)
		}

		// Validate new driver
		validateErr := createdUser.Validate()
		if validateErr != nil {
			// 400
			http.Error(w, "Driver data is invalid", http.StatusBadRequest)
		}
		validatedUser, err := createdUser.ToUser()
		if err != nil {
			// 400
			http.Error(w, "Driver data is invalid", http.StatusBadRequest)
		}

		// Insert new user
		insertedUser, err := ctx.UserStore.Insert(validatedUser)
		if err != nil {
			// 500
			http.Error(w, "Internal server error", http.StatusInternalServerError)
		}

		// Begin Session
		ctx.newSession(insertedUser, w)
		validUser, _ := ctx.UserStore.GetByID(insertedUser.ID)
		validUserJSON, _ := json.Marshal(validUser)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		w.Write(validUserJSON)

	} else {
		http.Error(w, "Must be a POST request method", http.StatusMethodNotAllowed)
	}
}

// Handles POST: Log in customer and returns a session ID
//		   DELETE: Log out a customer
func (ctx *HandlerContext) LoginCustomerHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		// Check Content-Type is JSON
		if r.URL.Query().Get("Content-Type") != "application/json" {
			// 415 Invalid Request Body
			http.Error(w, "Request body must be in JSON", http.StatusUnsupportedMediaType)
		}

		// Reading request body
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			// 415
			http.Error(w, "Error reading body into bytes", http.StatusUnsupportedMediaType)
		}

		// Unmarshalling request body into credentials struct
		userCredentials := &users.Credentials{}
		err = json.Unmarshal(body, &userCredentials)
		if err != nil {
			// 415
			http.Error(w, "Error unmarshalling body", http.StatusUnsupportedMediaType)
		}

		// Get user from sql db by email provided in credentials
		returningUser, err := ctx.UserStore.GetByEmail(userCredentials.email)
		if err != nil {
			// 401
			http.Error(w, "Email is not registered with an account", http.StatusUnauthorized)
		}

		// Authenticate the user's passhash returned by GetByEmail with the password provided in credentials
		err = returningUser.Authenticate(userCredentials.password)
		if err != nil {
			// 401
			http.Error(w, "Failed to authenticate the credentials", http.StatusUnauthorized)
		}

		// If user passes authenticate, begin session with returning user and get session ID
		sessionID, err := sessions.BeginSession(ctx.Key, ctx.SessionStore, returningUser)
		if err != nil {
			// 500
			http.Error(w, "Error begining session", http.StatusInternalServerError)
		}

		// Log the customer sign in with user id and IP address
		getIps := strings.Split(r.Header.Get("X-Forwareded-For"), ", ")
		err = ctx.UserStore.InsertLog(returningUser.id, getIps[0])
		if err != nil {
			// 500
			http.Error(w, "Error logging user sign in", http.StatusInternalServerError)
		}

		// Respond with new user profile encoded as a JSON object.
		encodeErr := json.NewEncoder(w).Encode(sessionID)
		if encodeErr != nil {
			// 500
			http.Error(w, "Error encoding and sending sessionID of customer", http.StatusInternalServerError)
		}
		// Respond with 200 status
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

	} else if r.Method == "DELETE" {
		// Ends session of the current user
		_, err := sessions.EndSession(r, ctx.Key, ctx.SessionStore)
		if err != nil {
			// 500
			http.Error(w, "Error ending session and logging out", http.StatusInternalServerError)
		}
		w.WriteHeader(http.StatusOK)

	} else {
		http.Error(w, "Must be a POST or DELETE request method", http.StatusMethodNotAllowed)
	}
}

// Handles POST: Log in driver and returns a session ID
//		   DELETE: Log out a driver
func (ctx *HandlerContext) LoginDriverHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		// Check Content-Type is JSON
		if r.URL.Query().Get("Content-Type") != "application/json" {
			// 415 Invalid Request Body
			http.Error(w, "Request body must be in JSON", http.StatusUnsupportedMediaType)
		}

		// Reading request body
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			// 415
			http.Error(w, "Error reading body into bytes", http.StatusUnsupportedMediaType)
		}

		// Unmarshalling request body into credentials struct
		userCredentials := &users.Credentials{}
		err = json.Unmarshal(body, &userCredentials)
		if err != nil {
			// 415
			http.Error(w, "Error unmarshalling body", http.StatusUnsupportedMediaType)
		}

		// Get user from sql db by email provided in credentials
		returningUser, err := ctx.UserStore.GetByEmail(userCredentials.email)
		if err != nil {
			// 401
			http.Error(w, "Email is not registered with an account", http.StatusUnauthorized)
		}

		// Authenticate the user's passhash returned by GetByEmail with the password provided in credentials
		err = returningUser.Authenticate(userCredentials.password)
		if err != nil {
			// 401
			http.Error(w, "Failed to authenticate the credentials", http.StatusUnauthorized)
		}

		// If user passes authenticate, begin session with returning user and get session ID
		sessionID, err := sessions.BeginSession(ctx.Key, ctx.SessionStore, returningUser)
		if err != nil {
			// 500
			http.Error(w, "Error begining session", http.StatusInternalServerError)
		}

		// Log the customer sign in with user id and IP address
		getIps := strings.Split(r.Header.Get("X-Forwareded-For"), ", ")
		err = ctx.UserStore.InsertLog(returningUser.id, getIps[0])
		if err != nil {
			// 500
			http.Error(w, "Error logging user sign in", http.StatusInternalServerError)
		}

		// Respond with new user profile encoded as a JSON object.
		encodeErr := json.NewEncoder(w).Encode(sessionID)
		if encodeErr != nil {
			// 500
			http.Error(w, "Error encoding and sending sessionID of driver", http.StatusInternalServerError)
		}
		// Respond with 200 status
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

	} else if r.Method == "DELETE" {
		// Ends session of the current user
		_, err := sessions.EndSession(r, ctx.Key, ctx.SessionStore)
		if err != nil {
			// 500
			http.Error(w, "Error ending session and logging out", http.StatusInternalServerError)
		}
		w.WriteHeader(http.StatusOK)

	} else {
		http.Error(w, "Must be a POST or DELETE request method", http.StatusMethodNotAllowed)
	}
}

func (ctx *HandlerContext) newSession(validUser *users.User, w http.ResponseWriter) {
	var state SessionState
	state.User = validUser
	state.StartTime = time.Now()

	_, err := sessions.BeginSession(ctx.SigningKey, ctx.SessionStore, state, w)

	if err != nil {
		fmt.Println("Error while creating new session")
	}
}
