// simple.js - Copy ALL of this
const http = require('http');

const users = [];

const server = http.createServer((req, res) => {
    // Allow ALL origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
    
    // Home page
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            message: 'Server is WORKING!', 
            users: users.length 
        }));
        return;
    }
    
    // Signup endpoint
    if (req.url === '/api/users/register' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                console.log('📝 SIGNUP DATA:', data);
                
                // Check required fields
                if (!data.name || !data.email || !data.password || !data.role) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: false, 
                        error: 'All fields required' 
                    }));
                    return;
                }
                
                // Add user
                const newUser = {
                    id: Date.now(),
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    createdAt: new Date()
                };
                users.push(newUser);
                
                console.log('✅ User added. Total:', users.length);
                
                // Success response
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: 'Signup SUCCESSFUL!',
                    user: newUser
                }));
                
            } catch (error) {
                console.error('❌ Error:', error.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    error: 'Invalid JSON' 
                }));
            }
        });
        return;
    }
    
    // Get all users
    if (req.url === '/api/users' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            count: users.length,
            users: users
        }));
        return;
    }
    
    // 404 for other routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log('========================================');
    console.log('✅ SERVER IS RUNNING!');
    console.log(`📍 http://localhost:${PORT}`);
    console.log('========================================');
    console.log('\n📝 TO TEST:');
    console.log('1. Open browser to: http://localhost:5000');
    console.log('2. Try your signup form');
    console.log('3. Watch this terminal for logs');
    console.log('\n⚠️  No MongoDB needed!');
    console.log('⚠️  No npm install needed!');
    console.log('========================================\n');
});