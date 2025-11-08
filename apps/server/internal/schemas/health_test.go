package schemas

import (
	"encoding/json"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestGetHealthResponseMarshaling(t *testing.T) {
	resp := GetHealthResponse{
		Status: "OK",
	}
	// Test JSON marshaling
	data, err := json.Marshal(resp)
	assert.NoError(t, err, "Failed to marshal response")
	// Test JSON unmarshaling
	var unmarshaled GetHealthResponse
	err = json.Unmarshal(data, &unmarshaled)
	assert.NoError(t, err, "Failed to unmarshal response")
	// Verify values match
	assert.Equal(t, resp.Status, unmarshaled.Status, "Status should match after marshal/unmarshal")
}
func TestGetHealthResponseJSON(t *testing.T) {
	resp := GetHealthResponse{
		Status: "OK",
	}
	data, err := json.Marshal(resp)
	assert.NoError(t, err, "Failed to marshal response")
	jsonStr := string(data)
	// Verify JSON contains expected fields
	assert.Contains(t, jsonStr, "status", "Expected 'status' field in JSON")
	assert.Contains(t, jsonStr, "OK", "Expected 'OK' value in JSON")
}
