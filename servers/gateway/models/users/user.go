package users

import (
	"fmt"
	"net/mail"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

//bcryptCost is the default bcrypt cost to use when hashing passwords
var bcryptCost = 13

//User represents a user account in the database
type User struct {
	ID        int64  `json:"id"`
	Email     string `json:"email"`
	PassHash  []byte `json:"-"` //never JSON encoded/decoded
	UserName  string `json:"userName"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	UserType  string `json:"type"`
}

//Credentials represents user sign-in credentials
type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	UserType string `json:"type"`
}

//NewUser represents a new user signing up for an account
type NewUser struct {
	Email        string `json:"email"`
	Password     string `json:"password"`
	PasswordConf string `json:"passwordConf"`
	UserName     string `json:"userName"`
	FirstName    string `json:"firstName"`
	LastName     string `json:"lastName"`
	UserType     string `json:"type"`
}

//Updates represents allowed updates to a user profile
type Updates struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

//Validate validates the new user and returns an error if
//any of the validation rules fail, or nil if its valid
func (nu *NewUser) Validate() error {
	//validate the new user according to these rules:
	//- Email field must be a valid email address (hint: see mail.ParseAddress)
	//- Password must be at least 6 characters
	//- Password and PasswordConf must match
	//- UserName must be non-zero length and may not contain spaces
	//use fmt.Errorf() to generate appropriate error messages if
	//the new user doesn't pass one of the validation rules
	_, err := mail.ParseAddress(nu.Email)
	if err != nil {
		return fmt.Errorf("Invalid email address")
	}

	if len(nu.Password) < 6 {
		return fmt.Errorf("Password should contain at least 6 characters")
	}

	if nu.Password != nu.PasswordConf {
		return fmt.Errorf("Password does not match the confirmation password")
	}

	if len(nu.UserName) == 0 || strings.Contains(nu.UserName, " ") {
		return fmt.Errorf("Enter a username with no spaces and non-zero length")
	}

	if nu.UserType != "customer" && nu.UserType != "driver" {
		return fmt.Errorf("UserType must be of type string with value of %v or %v - %v", CustomerType, DriverType, nu.UserType)
	}

	return nil
}

//ToUser converts the NewUser to a User, setting the
//PhotoURL and PassHash fields appropriately
func (nu *NewUser) ToUser() (*User, error) {
	//call Validate() to validate the NewUser and
	//return any validation errors that may occur.
	//if valid, create a new *User and set the fields
	//based on the field values in `nu`.

	//field of the User to a hash of the NewUser.Password
	userValidation := nu.Validate()
	if userValidation != nil {
		return nil, userValidation
	}

	var validUser User
	validUser.UserName = nu.UserName
	validUser.FirstName = nu.FirstName
	validUser.LastName = nu.LastName
	validUser.Email = nu.Email
	validUser.UserType = nu.UserType

	passwordErr := validUser.SetPassword(nu.Password)
	if passwordErr != nil {
		return nil, passwordErr
	}

	return &validUser, nil
}

//FullName returns the user's full name, in the form:
// "<FirstName> <LastName>"
//If either first or last name is an empty string, no
//space is put between the names. If both are missing,
//this returns an empty string
func (u *User) FullName() string {
	//implement according to comment above
	return strings.TrimSpace(u.FirstName + " " + u.LastName)
}

//SetPassword hashes the password and stores it in the PassHash field
func (u *User) SetPassword(password string) error {
	//use the bcrypt package to generate a new hash of the password
	//https://godoc.org/golang.org/x/crypto/bcrypt
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), bcryptCost)
	if err != nil {
		return err
	}
	u.PassHash = passwordHash
	return nil
}

//Authenticate compares the plaintext password against the stored hash
//and returns an error if they don't match, or nil if they do
func (u *User) Authenticate(password string) error {
	//use the bcrypt package to compare the supplied
	//password with the stored PassHash
	//https://godoc.org/golang.org/x/crypto/bcrypt
	err := bcrypt.CompareHashAndPassword(u.PassHash, []byte(password))
	if err != nil {
		return err
	}
	return nil
}

//ApplyUpdates applies the updates to the user. An error
//is returned if the updates are invalid
func (u *User) ApplyUpdates(updates *Updates) error {
	//set the fields of `u` to the values of the related
	//field in the `updates` struct
	if len(updates.FirstName) == 0 && len(updates.LastName) == 0 {
		return fmt.Errorf("Invalid update information")
	}
	u.FirstName = updates.FirstName
	u.LastName = updates.LastName
	return nil
}
