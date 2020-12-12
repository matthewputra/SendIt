package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
	"sync/atomic"
	"time"

	"github.com/go-redis/redis"
	_ "github.com/go-sql-driver/mysql"
	"github.com/matthewputra/SendIt/servers/gateway/models/users"
	"github.com/matthewputra/SendIt/servers/gateway/sessions"

	"github.com/matthewputra/SendIt/servers/gateway/handlers"
)

// Director helps in directoring the request to the appropriate
// microservice
type Director func(r *http.Request)

// SpecificDirector creates the Director function to be passed
// to the ReverseProxy
func SpecificDirector(context *handlers.HandlerContext, targetURLs []*url.URL) Director {
	var count int32
	count = 0

	return func(r *http.Request) {
		currSession := &handlers.SessionState{}
		_, err := sessions.GetState(r, context.SigningKey, context.SessionStore, currSession)

		if err == nil {
			encodedUser, _ := json.Marshal(currSession.User)
			fmt.Println(encodedUser)
			r.Header.Add("X-User", string(encodedUser))
		} else {
			// r.Header.Del("X-User")
			log.Print(err)
		}

		targetURL := targetURLs[count%int32(len(targetURLs))]
		atomic.AddInt32(&count, 1)
		r.Header.Add("X-Forwarded-Host", r.Host)
		r.Host = targetURL.Host
		r.URL.Host = targetURL.Host
		r.URL.Scheme = targetURL.Scheme
	}
}

//main is the main entry point for the server
func main() {
	ADDR := os.Getenv("ADDR")
	if len(ADDR) == 0 {
		ADDR = ":443"
	}

	TLSCERT := os.Getenv("TLSCERT")
	TLSKEY := os.Getenv("TLSKEY")
	if len(TLSCERT) == 0 || len(TLSKEY) == 0 {
		os.Stdout.Write([]byte("No TLS environment variables found\n"))
		os.Exit(1)
	}

	SESSIONKEY := os.Getenv("SESSIONKEY")
	REDISADDR := os.Getenv("REDISADDR")
	DSN := os.Getenv("DSN")

	// TODO: Get PORT for the microservice

	// TODO: Change this for the microservice
	messageAddrSlice := strings.Split(MESSAGEADDR, ",")
	var messageURLs []*url.URL

	// TODO: Change this for the microservice
	for _, v := range messageAddrSlice {
		messageURLs = append(messageURLs, &url.URL{Scheme: "http", Host: v})
	}

	redisClient := redis.NewClient(&redis.Options{Addr: REDISADDR, Password: "", DB: 0})
	redisStore := sessions.NewRedisStore(redisClient, time.Hour)

	db, err := sql.Open("mysql", DSN)
	if err != nil {
		fmt.Println("cannot open db - " + err.Error())
		os.Exit(1)
	}
	defer db.Close()

	ctx := &handlers.HandlerContext{SigningKey: SESSIONKEY, SessionStore: redisStore, UserStore: users.NewMySQLStore(db)}

	// TODO: Change this for the microservice
	messagingProxy := &httputil.ReverseProxy{Director: SpecificDirector(ctx, messageURLs)}

	mux := http.NewServeMux()

	// Handlers for logging in and signing up new customers/drivers
	mux.HandleFunc("/v1/customer", ctx.NewCustomerHandler)
	mux.HandleFunc("/v1/customer/login", ctx.LoginCustomerHandler)
	mux.HandleFunc("/v1/driver", ctx.NewDriverHandler)
	mux.HandleFunc("/v1/driver/login", ctx.LoginDriverHandler)

	// TODO: Change this according to the microservice
	mux.Handle("/v1/channels", messagingProxy)
	mux.Handle("/v1/channels/", messagingProxy)
	mux.Handle("/v1/messages/", messagingProxy)

	wrappedMux := handlers.NewCORS(mux)

	log.Printf("Server is listening at %s...", ADDR)
	log.Fatal(http.ListenAndServeTLS(ADDR, TLSCERT, TLSKEY, wrappedMux))

}
