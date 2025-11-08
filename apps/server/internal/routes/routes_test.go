package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"net/http"
	"testing"
)

func TestSetupRoutes(t *testing.T) {
	app := fiber.New()
	SetupRoutes(app)
	// Verify that routes were registered
	routes := app.GetRoutes()
	assert.NotEmpty(t, routes, "Expected routes to be registered")
}
func TestSetupHealthRoutes(t *testing.T) {
	app := fiber.New()
	SetupHealthRoutes(app)
	// Verify routes were registered
	routes := app.GetRoutes()
	assert.NotEmpty(t, routes, "Expected health routes to be registered")
	// Test the health endpoint
	req, _ := http.NewRequest("GET", "/health", nil)
	res, err := app.Test(req, -1)
	assert.NoError(t, err, "Request should not error")
	assert.Equal(t, fiber.StatusOK, res.StatusCode, "Expected status 200")
}
func TestSetupAPIV1Routes(t *testing.T) {
	app := fiber.New()
	apiV1 := app.Group("/api/v1")
	// Should not panic
	assert.NotPanics(t, func() {
		SetupAPIV1Routes(apiV1)
	}, "SetupAPIV1Routes should not panic")
}
