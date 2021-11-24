package main

import (
	"os"

	"github.com/anaskhan96/soup"
)

func main() {
	// Read content of file
	content, err := os.ReadFile(os.Args[1])
	if err != nil {
		panic(err)
	}

	doc := soup.HTMLParse(string(content))
	users := doc.FindAll("a", "class", "FPmhX")
	followersFile, err := os.Create("../followers.txt")
	defer followersFile.Close()
	if err != nil {
		panic(err)
	}
	for _, user := range users {
		formattedUser := "@" + user.Text()
		followersFile.WriteString(formattedUser + "\n")
	}
}
