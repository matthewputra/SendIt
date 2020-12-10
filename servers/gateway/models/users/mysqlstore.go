package users

import (
	"database/sql"
	"errors"
	"time"
)

// MySQLStore represents a session store backed by MySQL
type MySQLStore struct {
	db *sql.DB
}

// NewMySQLStore constructs a new MySQLStore
func NewMySQLStore(DB *sql.DB) *MySQLStore {
	return &MySQLStore{
		db: DB,
	}
}

// Store Implementation

// GetByID with the given ID
func (mss *MySQLStore) GetByID(id int64) (*User, error) {
	query := "SELECT id,email,passHash,username,firstName,lastName,photoUrl FROM Users WHERE id=?"
	row, err := mss.db.Query(query, id)
	if err != nil {
		return nil, err
	}

	var user User
	if row.Next() {
		err = row.Scan(&user.ID,
			&user.Email,
			&user.PassHash,
			&user.UserName,
			&user.FirstName,
			&user.LastName,
			&user.UserType)
		if err != nil {
			return nil, err
		}
	}
	return &user, nil
}

// GetByEmail returns the user with the given email
func (mss *MySQLStore) GetByEmail(email string) (*User, error) {
	query := "SELECT id,email,passhash,username,firstname,lastname,photourl FROM Users WHERE email=?"
	row, err := mss.db.Query(query, email)
	if err != nil {
		return nil, err
	}

	var user User
	if row.Next() {
		err = row.Scan(&user.ID,
			&user.Email,
			&user.PassHash,
			&user.UserName,
			&user.FirstName,
			&user.LastName,
			&user.UserType)
		if err != nil {
			return nil, err
		}
	}
	return &user, nil
}

// GetByUserName returns the user with the given username
func (mss *MySQLStore) GetByUserName(username string) (*User, error) {
	query := "SELECT id,email,passhash,username,firstname,lastname,photourl FROM Users WHERE username=?"
	row, err := mss.db.Query(query, username)
	if err != nil {
		return nil, err
	}

	var user User
	if row.Next() {
		err = row.Scan(&user.ID,
			&user.Email,
			&user.PassHash,
			&user.UserName,
			&user.FirstName,
			&user.LastName,
			&user.UserType)
		if err != nil {
			return nil, err
		}
	}
	return &user, nil
}

// Insert creates a new user in the MySQLStore and returns the
// created user
func (mss *MySQLStore) Insert(user *User) (*User, error) {
	query := "INSERT INTO Users(email, passhash, username, firstname, lastname, photoURL) VALUES (?, ?, ?, ?, ?, ?)"
	res, err := mss.db.Exec(query, user.Email, user.PassHash, user.UserName, user.FirstName, user.LastName, user.UserType)
	if err != nil {
		return nil, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return nil, err
	}
	return mss.GetByID(id)
}

// Update updates the information of the user with the given ID and
// returns the user with the updated information
func (mss *MySQLStore) Update(id int64, updates *Updates) (*User, error) {
	query := "UPDATE Users SET firstname = ?, lastname = ? WHERE id = ?"
	_, err := mss.db.Exec(query, updates.FirstName, updates.LastName, id)
	if err != nil {
		return nil, err
	}
	return mss.GetByID(id)
}

// Delete deletes the user from the MySQLStore with the given ID
func (mss *MySQLStore) Delete(id int64) error {
	query := "DELETE FROM Users WHERE id=?"
	_, err := mss.db.Exec(query, id)
	if err != nil {
		return err
	}
	return nil
}

// InsertLog inserts sign-in log to logs in the database
func (mss *MySQLStore) InsertLog(userID int64, ipAddr string) error {
	query := "INSERT INTO SignInLogs(UserID, LoginTime, IP) VALUES (?, ?, ?)"
	loginTime := time.Now()
	_, err := mss.db.Exec(query, userID, loginTime, ipAddr)

	if err != nil {
		return errors.New("Error logging the sign-in action")
	}
	return nil
}
