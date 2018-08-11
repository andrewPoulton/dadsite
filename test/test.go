package test

import (
	"fmt"
	"net/http"
)

func HelloWorld(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World")
}

func Other(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Other page")
}

// func main1() {
// 	http.HandleFunc("/", helloWorld)
// 	http.HandleFunc("/alt", other)
// 	http.ListenAndServe(":8080", nil)
// }
