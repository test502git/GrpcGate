package main

import (
    "context"
    "log"
    "net/http"
    "strings"
    pb "go_grpc_webtest/proto"
    "github.com/improbable-eng/grpc-web/go/grpcweb"
    "google.golang.org/grpc"
)

type server struct {
    pb.UnimplementedAuthServer
}

func (s *server) Login(ctx context.Context, req *pb.LoginRequest) (*pb.LoginResponse, error) {
    // Simple authentication logic (for demo purposes)
    if req.Username == "admin" && req.Password == "password" {
        return &pb.LoginResponse{
            Success: true,
            Message: "Login successful",
        }, nil
    }
    return &pb.LoginResponse{
        Success: false,
        Message: "Invalid credentials",
    }, nil
}

func corsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, X-User-Agent, X-Grpc-Web")

        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        next.ServeHTTP(w, r)
    })
}

func main() {
    // Create a new gRPC server
    grpcServer := grpc.NewServer()
    pb.RegisterAuthServer(grpcServer, &server{})

    // Wrap grpc server with grpc-web
    wrappedGrpc := grpcweb.WrapServer(grpcServer,
        grpcweb.WithOriginFunc(func(origin string) bool {
            return true // Allow all origins for demo
        }),
        grpcweb.WithWebsockets(true),
        grpcweb.WithWebsocketOriginFunc(func(req *http.Request) bool {
            return true
        }),
    )

    // Create an HTTP server with CORS middleware
    handler := http.HandlerFunc(func(resp http.ResponseWriter, req *http.Request) {
        // Serve static files
        if req.URL.Path == "/" {
            http.ServeFile(resp, req, "static/index.html")
            return
        }
        if strings.HasPrefix(req.URL.Path, "/dist/") {
            http.ServeFile(resp, req, "static"+req.URL.Path)
            return
        }
        // Handle gRPC requests
        if wrappedGrpc.IsGrpcWebRequest(req) || wrappedGrpc.IsAcceptableGrpcCorsRequest(req) {
            wrappedGrpc.ServeHTTP(resp, req)
            return
        }
        // Default to 404
        http.NotFound(resp, req)
    })

    httpServer := &http.Server{
        Addr:    ":8080",
        Handler: corsMiddleware(handler),
    }

    log.Printf("Server starting on :8080")
    if err := httpServer.ListenAndServe(); err != nil {
        log.Fatalf("Failed to serve: %v", err)
    }
}
