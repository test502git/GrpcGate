const { LoginRequest } = require('./auth_pb.js');
const { AuthClient } = require('./auth_grpc_web_pb.js');

const client = new AuthClient('http://107.150.106.94:8080');

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    console.log('Attempting login with:', { username });

    const request = new LoginRequest();
    request.setUsername(username);
    request.setPassword(password);

    try {
        client.login(request, {}, (err, response) => {
            if (err) {
                console.error('Login error:', err);
                messageDiv.style.color = 'red';
                messageDiv.textContent = 'Error: ' + err.message;
                return;
            }
            
            console.log('Login response:', response.toObject());
            messageDiv.style.color = response.getSuccess() ? 'green' : 'red';
            messageDiv.textContent = response.getMessage();
        });
    } catch (error) {
        console.error('Exception during login:', error);
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Error: ' + error.message;
    }
}

// Make login function globally available
window.login = login;
