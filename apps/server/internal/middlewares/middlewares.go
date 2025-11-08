package middlewares

import "github.com/gofiber/fiber/v2"

// SetupMiddlewares wires all middlewares together
func SetupMiddlewares(app *fiber.App) {
	// Setup logger middleware
	SetupLogger(app)

	// Setup CORS middleware
	SetupCORS(app)
}
