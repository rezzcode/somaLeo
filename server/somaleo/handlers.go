package somaLeo

import (
	"encoding/json"
	"net/http"
	"strconv"
	"sync"
	"time"
)

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

func MessagesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodPost:
		var reqBody struct {
			Message    string  `json:"message"`
			Question   string  `json:"question"`
			Subject    *string `json:"subject,omitempty"`
			Competency *string `json:"competency,omitempty"`
			SessionId  *string `json:"sessionId,omitempty"`
		}
		if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
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

		sessionId := "default"
		if reqBody.SessionId != nil && *reqBody.SessionId != "" {
			sessionId = *reqBody.SessionId
		}

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
