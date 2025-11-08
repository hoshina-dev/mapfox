package routes

import (
	"mapfox/server/internal/handlers/health_handler"

	"github.com/gofiber/fiber/v2"
)

func SetupHealthRoutes(app fiber.Router) {
	healthHandler := health_handler.NewHandler()

	health := app.Group("/health")
	health.Get("/", healthHandler.GetHealthStatus)
}
