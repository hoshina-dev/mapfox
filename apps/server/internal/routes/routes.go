package routes

import "github.com/gofiber/fiber/v2"

func SetupRoutes(app *fiber.App) {
	// Health routes at root level
	SetupHealthRoutes(app)

	// API v1 routes
	apiV1 := app.Group("/api/v1")
	SetupAPIV1Routes(apiV1)
}

func SetupAPIV1Routes(api fiber.Router) {
	// API v1 routes will be added here
}
