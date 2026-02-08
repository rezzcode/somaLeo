package main

/**
 * ========= MAIN.GO FILE NOTES =========
 * 
 * This file has the entire program.
 * the files in somaleo module just have
 * the content of this file as i was just trying to refactor
 * this code such that it can be easy to maintain
 * 
 * while if you are only intrested in running the backend server...
 * just execute `go run .` or go build main.go and run the exec file
 * 
 * 
 * ========= REFACTORING NOTES =========
 * 
 * if you are looking foward to help in refactoring the code..
 * then on your development process change this file to main.txt instead of main.go
 * then create a new file main.go and use it together with the files in somaleo module
 * durring the dev process.
 * 
 * Notes by: rezzcode/the1Riddle
 * 
 */

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"sync"
	"time"
)

/**
 *
 * AGENT STRUCTS
 */

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type Agent struct {
	Messages []Message
	ApiKey   string
	mu       sync.Mutex
}

/**
 * AGENT CREATION
 */

func NewAgent() (*Agent, error) {
	key := os.Getenv("OPENROUTER_API_KEY")
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

If grade not mentioned, ask learner to choose Grade 6–9.
`

	return &Agent{
		ApiKey: key,
		Messages: []Message{
			{Role: "system", Content: systemPrompt},
		},
	}, nil
}

/**
 *
 * AGENT ASK METHOD
 *
 */

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

/**
 *
 * HTTP HANDLERS
 *
 */

type APIMessage struct {
	ID         string    `json:"id"`
	Content    string    `json:"content"`
	Sender     string    `json:"sender"`
	Timestamp  time.Time `json:"timestamp"`
	Subject    *string   `json:"subject,omitempty"`
	Competency *string   `json:"competency,omitempty"`
}

type AgentResponse struct {
	Response string `json:"response"`
}

var (
	ai        *Agent
	sessions  = make(map[string][]APIMessage)
	sessionsM sync.Mutex
)

func messagesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodPost:
		var reqBody struct {
			Message    string  `json:"message"`
			Question   string  `json:"question"` // optional alias
			Subject    *string `json:"subject,omitempty"`
			Competency *string `json:"competency,omitempty"`
			SessionId  *string `json:"sessionId,omitempty"`
		}
		const maxBodyBytes = 1 << 20 // 1 MiB
		limitedBody := http.MaxBytesReader(w, r.Body, maxBodyBytes)
		defer limitedBody.Close()
		if err := json.NewDecoder(limitedBody).Decode(&reqBody); err != nil {
			http.Error(w, "Invalid JSON body", http.StatusBadRequest)
			return
		}

		userText := reqBody.Message
		if userText == "" {
			userText = reqBody.Question
		}
		if userText == "" {
			http.Error(w, "message required", http.StatusBadRequest)
			return
		}

		if ai == nil {
			http.Error(w, "AI agent not initialized", http.StatusInternalServerError)
			return
		}

		// ensure session id
		sessionId := "default"
		if reqBody.SessionId != nil && *reqBody.SessionId != "" {
			sessionId = *reqBody.SessionId
		}

		// create user APIMessage and store
		userMsg := APIMessage{
			ID:         time.Now().Format("20060102150405.000000000"),
			Content:    userText,
			Sender:     "user",
			Timestamp:  time.Now(),
			Subject:    reqBody.Subject,
			Competency: reqBody.Competency,
		}

		sessionsM.Lock()
		sessions[sessionId] = append(sessions[sessionId], userMsg)
		sessionsM.Unlock()

		// ask AI
		reply, err := ai.Ask(userText)
		if err != nil {
			http.Error(w, "AI error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		aiMsg := APIMessage{
			ID:         time.Now().Format("20060102150405.000000000"),
			Content:    reply,
			Sender:     "ai",
			Timestamp:  time.Now(),
			Subject:    reqBody.Subject,
			Competency: reqBody.Competency,
		}

		sessionsM.Lock()
		sessions[sessionId] = append(sessions[sessionId], aiMsg)
		sessionsM.Unlock()

		// return the ai message (frontend can append to UI)
		json.NewEncoder(w).Encode(aiMsg)
		return

	case http.MethodGet:
		query := r.URL.Query()
		sessionId := query.Get("sessionId")
		if sessionId == "" {
			sessionId = "default"
		}
		limit := 0
		if l := query.Get("limit"); l != "" {
			if parsed, err := strconv.Atoi(l); err == nil {
				limit = parsed
			}
		}

		sessionsM.Lock()
		msgs := sessions[sessionId]
		sessionsM.Unlock()

		if limit > 0 && len(msgs) > limit {
			msgs = msgs[len(msgs)-limit:]
		}

		json.NewEncoder(w).Encode(msgs)
		return

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
}

/**
 *
 * Add CORS middleware
 *
 */

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

/**
 *
 * MAIN
 *
 */

func main() {
	var err error
	ai, err = NewAgent()
	if err != nil {
		log.Fatal(err)
	}

	http.Handle("/api/tutor/messages", corsMiddleware(http.HandlerFunc(messagesHandler)))

	log.Println("🚀 Server running on http://localhost:8080/api/tutor/messages")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
