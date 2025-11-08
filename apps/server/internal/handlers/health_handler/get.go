package health_handler

import (
	"mapfox/server/internal/schemas"

	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetHealthStatus(c *fiber.Ctx) error {
	response := schemas.GetHealthResponse{
		Status: "OK",
	}

	return c.Status(fiber.StatusOK).JSON(response)
}
