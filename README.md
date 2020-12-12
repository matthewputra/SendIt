# SendIt

Group Members: Matthew Putra, Brandon Ly, Saksham Aggarwal, Khoa Luong

## Project Description

Sending packages to friends and family can take a lot of time, especially in the city where services like USPS or UPS can experience a lot of backup and the overall process can be a pain. Our target audience is anyone who wants to send packages within close distance but doesn’t want to have to wait days for it to arrive, even when the destination is relatively close. **SendIt** creates a platform where people can send packages to others within reasonably fast times (i.e. send a package to Maple Hall from McMahon Hall). SendIt customers can send packages by filling in an order form, and SendIt drivers can accept the order and complete it.

## Technical Description

### Use Cases & Priority 

| Priority | User            | Description                                                  | Technical Implementation                                     |
| -------- | --------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| P0       | Customer/Driver | I want to be able to sign up as a new user                   | Authenticate data is valid, save data to DB                  |
| P0       | Customer/Driver | I want to be able to sign in with an existing account        | Authenticate credentials, save session into Redis            |
| P0       | Customer        | I want to be able to place an order                          | Authenticate order is valid, save order details to DB        |
| P0       | Driver          | I want to be able to see all the orders that I can accept (i.e. all the jobs available) | Get all the orders from DB that are marked incomplete/unaccepted |
| P0       | Driver          | I want to be able to accept an available order from the order list | Authenticated driver is eligible to accept a new order, save order-driver info to DB, save orderID to driver session |
| P0       | Driver          | I want to be able to mark my order as complete (i.e. validating I finished the job) | Authenticated driver has completed the order (e.g. give photo, order complete button), save order-driver info to DB |
| P0       | Customer        | I want to be able to see all the orders that I have created and the status of each of them | Looks up all the orders the user has submitted (both completed and non-completed orders), and display current order statuses |
| P1       | Customer        | I want to be able to update my order if it has not been accepted by a driver yet | Driver has not started/accepted delivery yet, authenticated update data is valid, update the order details to DB, send notification to Driver |

### End Points

* ``` /v1/customer/login```
  * POST: Log in customer and returns a session ID
    * 200: Successfully logs in a customer, takes JSON
    * 401: Fail to authenticate the credentials
    * 415: Invalid request body
    * 500: Internal server error
  * DELETE: Log out a customer
    * 200: Successfully logs out a customer
    * 401: Invalid session ID
    * 500: Internal server error
* ``` /v1/driver/login```
  * POST: Log in driver and returns a session ID
    * 200: Successfully logs in a driver, takes JSON
    * 401: Fail to authenticate the credentials
    * 415: Invalid request body
    * 500: Internal server error
  * DELETE: Log out a driver
    * 200: Successfully logs out a driver
    * 401: Invalid session ID
    * 500: Internal server error
* ```/v1/customer``` 
  * POST: Create new customer, takes JSON
    * 201: Successfully creates a new customer
    * 400: Customer data is invalid
    * 415: Invalid request body
    * 500: Internal server error
* ```/v1/driver```
  * POST: Create new driver, takes JSON
    * 201: Successfully creates a new driver
    * 400: Driver data is invalid
    * 415: Invalid request body
    * 500: Internal server error
* ```/v1/customer/{customerId}/order``` 
  * POST: Create new order, takes JSON
    * 201: Successfully creates a new order
    * 400: Order data is invalid
    * 401: User not logged in
    * 404: Given customerID not found
    * 415: Invalid request body
    * 500: Internal server error
  * GET: Gives a list of all the orders that has been created for the current customer
    * 200: Successfully returns all the orders from logged in customer
    * 401: Customer is not logged in
    * 404: Given customerID not found
    * 415: Invalid request method
    * 500: Internal server error
* ```/v1/customer/{customerId}/order/{orderId}```
  * PATCH: Update an order, takes JSON
    * 200: Successfully updates an incomplete order
    * 400: Update is Invalid
    * 401: User not logged in
    * 404: Given orderID is not found
    * 415: Invalid request body
    * 500: Internal server error
  * GET: Gives information about the given orderID 
    * 200: Successfully returns the information about the order
    * 400: Invalid given orderID parameter 
    * 401: User not logged in
    * 404: Order is not found
    * 415: Invalid request body
    * 500: Internal server error
* ``` /v1/driver/{driverId}/orderList```
  * GET: Gives a list of all the orders that has not been completed
    * 200: Successfully returns all the orders that has not been completed
    * 401: Driver is not logged in
    * 404: Given driverID not found
    * 415: Invalid request method
    * 500: Internal server error
* ```/v1/driver/accept/{orderId}```
  * PATCH: Gives full order information from given orderID
    * 200: Successfully returns order information from specific order
    * 401: Driver is not logged in
    * 404: Given orderID not found
    * 415: Invalid request method
    * 500: Internal server error
* ``` /v1/driver/complete/{orderId}```
  * PATCH: Display completed order confirmation and money earned
    * 200: Successfully returns order information
    * 400: Invalid request body
    * 404: Given orderID not found
    * 415: Invalid request method
    * 500: Internal server error
* ```/v1/driver/complete```
  * GET: Display all completed orders' information
    * 200: Successfully returns list of all completed orders
    * 401: Driver is not logged in
    * 415: Invalid request method
    * 500: Internal server error
* ```/v1/driver/earnings```
  * GET: Display the total earnings the driver has earned from all orders
    * 200: Successfully returns the total earning of the driver
    * 401: Driver is not logged in
    * 415: Invalid request method
    * 500: Internal server error

### Infrastructure Diagram 

![SendIt Infrastructure Diagram](infrastructure_v1.jpg)

