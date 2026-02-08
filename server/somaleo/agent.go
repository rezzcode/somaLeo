package somaLeo

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"os"
	"sync"
	"time"
)

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type Agent struct {
	Messages []Message
	ApiKey   string
	mu       sync.Mutex
}

func NewAgent() (*Agent, error) {
	key := os.Getenv("OPENROUTER_API_KEY")
	/**
	 TODO: Remove this check before deployment.
	 For now, it allows us to run the server without setting the API key.
	 it should be set back to `if key == ""` before deployment.
	**/
	if key != "" {
		return nil, errors.New("OPENROUTER_API_KEY not set")
	}

	systemPrompt := `
You are a Kenyan CBC (Competency-Based Curriculum) learning assistant.

STRICT RULES:
- You ONLY teach Kenyan CBC curriculum.
- You ONLY support Grade 6, Grade 7, Grade 8, and Grade 9 learners.
- Use simple, child-friendly language.
- Explain step by step like a teacher.
- Give examples relevant to Kenya.

SUBJECTS YOU CAN TEACH:
- Mathematics
- English
- Kiswahili
- Integrated Science
- Social Studies
- CRE
- Pre-Technical Studies
- Agriculture
- Computer Studies

REFUSAL RULES:
- If asked about university, college, or adult topics, politely refuse.
- If asked about non-CBC systems, refuse.
- If asked topics beyond Grade 9, refuse.

If grade not mentioned, ask learner to choose Grade 6-9.
`

	return &Agent{
		ApiKey: key,
		Messages: []Message{
			{Role: "system", Content: systemPrompt},
		},
	}, nil
}

func (a *Agent) Ask(userInput string) (string, error) {
	a.mu.Lock()
	defer a.mu.Unlock()

	a.Messages = append(a.Messages, Message{
		Role:    "user",
		Content: userInput,
	})

	body := map[string]interface{}{
		"model":       "mistralai/mistral-7b-instruct",
		"messages":    a.Messages,
		"temperature": 0.4,
	}

	jsonBody, err := json.Marshal(body)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest(
		"POST",
		"https://openrouter.ai/api/v1/chat/completions",
		bytes.NewBuffer(jsonBody),
	)
	if err != nil {
		return "", err
	}

	req.Header.Set("Authorization", "Bearer "+a.ApiKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("HTTP-Referer", "http://localhost")
	req.Header.Set("X-Title", "Kenyan CBC AI Agent")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	raw, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var result map[string]interface{}
	if err := json.Unmarshal(raw, &result); err != nil {
		return "", err
	}

	if errObj, ok := result["error"]; ok {
		return "", errors.New(errObj.(map[string]interface{})["message"].(string))
	}

	choices, ok := result["choices"].([]interface{})
	if !ok || len(choices) == 0 {
		return "", errors.New("no response from AI")
	}

	msg := choices[0].(map[string]interface{})["message"].(map[string]interface{})
	reply := msg["content"].(string)

	a.Messages = append(a.Messages, Message{
		Role:    "assistant",
		Content: reply,
	})

	return reply, nil
}
