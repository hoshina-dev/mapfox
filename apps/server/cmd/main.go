package main

import (
	"log"
	"mapfox/server/internal/middlewares"
	"mapfox/server/internal/routes"

	"github.com/gofiber/fiber/v2"
)

func main() {
	// Create a new Fiber instance
	app := fiber.New(fiber.Config{
		ServerHeader: "MapFox Server",
		AppName:      "MapFox",
	})

	// Setup middlewares first (before routes)
	middlewares.SetupMiddlewares(app)

	// Setup routes
	routes.SetupRoutes(app)

	// Start the server
	log.Fatal(app.Listen(":8080"))
}
