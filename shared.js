// Shared JavaScript for AI Sentinel-X

// Global state
let chatOpen = false;
let agentActive = true;
let cliMode = false;

// Neural Network Background Animation
function initNeuralBackground() {
    const canvas = document.getElementById('neuralCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const nodes = [];
    const nodeCount = 100;
    
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update nodes
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        });
        
        // Draw connections
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
        ctx.lineWidth = 0.5;
        
        nodes.forEach((node1, i) => {
            nodes.slice(i + 1).forEach(node2 => {
                const dist = Math.hypot(node1.x - node2.x, node1.y - node2.y);
                if (dist < 100) {
                    ctx.globalAlpha = 1 - dist / 100;
                    ctx.beginPath();
                    ctx.moveTo(node1.x, node1.y);
                    ctx.lineTo(node2.x, node2.y);
                    ctx.stroke();
                }
            });
        });
        
        // Draw nodes
        ctx.globalAlpha = 1;
        nodes.forEach(node => {
            const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 2);
            gradient.addColorStop(0, 'rgba(0, 255, 136, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Handle window resize
window.addEventListener('resize', () => {
    initNeuralBackground();
});

// Agent Status Management
function showAgentShutdownModal() {
    const modal = document.getElementById('agentShutdownModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal() {
    const modal = document.getElementById('agentShutdownModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeModalOnOverlay(event) {
    if (event.target.classList.contains('modal-overlay')) {
        closeModal();
    }
}

function confirmAgentShutdown() {
    agentActive = false;
    
    // Update header status
    const agentStatus = document.querySelector('.agent-status');
    if (agentStatus) {
        agentStatus.style.background = 'rgba(255, 170, 0, 0.1)';
        agentStatus.style.borderColor = '#ffaa00';
        
        const statusTitle = agentStatus.querySelector('.agent-title');
        const statusText = agentStatus.querySelector('.agent-status-text');
        if (statusTitle) statusTitle.textContent = 'AI Agent Paused';
        if (statusTitle) statusTitle.style.color = '#ffaa00';
        if (statusText) statusText.textContent = 'Manual Control Only';
    }
    
    closeModal();
    
    // Show notification in chat
    if (chatOpen) {
        addChatMessage('⚠️ Main Agent has been paused. Manual control is now active. I will operate in local CLI mode if external connections fail.', false, 'system');
    }
}

// Logout handler
function handleLogout() {
    if (confirm('Are you sure you want to logout? The AI agent will continue protecting your systems autonomously.')) {
        localStorage.removeItem('sentinel_auth');
        window.location.href = 'index.html';
    }
}

// AI Chat functionality
function toggleChat() {
    chatOpen = !chatOpen;
    const chatWindow = document.getElementById('aiChatWindow');
    if (chatOpen) {
        chatWindow.classList.add('active');
    } else {
        chatWindow.classList.remove('active');
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('aiChatInput');
    const message = input.value.trim();
    if (!message) return;

    // Add user message
    addChatMessage(message, true);
    input.value = '';

    // Process command
    processCommand(message);
}

function addChatMessage(message, isUser, type = 'normal') {
    const messagesContainer = document.getElementById('aiChatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message';
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let bubbleClass = 'ai-message-bubble';
    if (isUser) bubbleClass += ' user';
    if (type === 'system') bubbleClass += ' system';
    
    messageDiv.innerHTML = `
        <div class="${bubbleClass}">${message}</div>
        <div class="ai-message-time">${time}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function processCommand(command) {
    const lowerCommand = command.toLowerCase();
    
    // Check if Main Agent is active
    if (!agentActive || cliMode) {
        processCLICommand(command);
        return;
    }
    
    // Simulate routing to Main Agent
    setTimeout(() => {
        addChatMessage('Routing to Main Agent...', false, 'system');
        
        setTimeout(() => {
            // Route to appropriate sub-agent
            if (lowerCommand.includes('threat') || lowerCommand.includes('attack')) {
                addChatMessage('Main Agent: Routing to ThreatScanner sub-agent...', false, 'system');
                setTimeout(() => {
                    addChatMessage('ThreatScanner: Currently tracking 7 active threats. 2 critical SQL injection attempts blocked. DDoS mitigation active on port 80. All threats contained with hybrid encryption logging.', false);
                }, 800);
            } else if (lowerCommand.includes('network') || lowerCommand.includes('device')) {
                addChatMessage('Main Agent: Routing to NetworkMapper sub-agent...', false, 'system');
                setTimeout(() => {
                    addChatMessage('NetworkMapper: 247 devices discovered on network. 12 new devices in last hour. All communications secured with Classical + Post-Quantum encryption.', false);
                }, 800);
            } else if (lowerCommand.includes('encrypt') || lowerCommand.includes('crypto')) {
                addChatMessage('Main Agent: Routing to EncryptionManager sub-agent...', false, 'system');
                setTimeout(() => {
                    addChatMessage('EncryptionManager: Hybrid mode active. Classical: AES-256-GCM, HMAC-SHA256. Post-Quantum: CRYSTALS-Kyber, Dilithium. All channels protected.', false);
                }, 800);
            } else if (lowerCommand.includes('defense') || lowerCommand.includes('response')) {
                addChatMessage('Main Agent: Routing to DefenseOrchestrator sub-agent...', false, 'system');
                setTimeout(() => {
                    addChatMessage('DefenseOrchestrator: 18 security policies active. Automated response enabled. Last action: Blocked 45K malicious requests. All actions logged with quantum-resistant signatures.', false);
                }, 800);
            } else if (lowerCommand.includes('log') || lowerCommand.includes('audit')) {
                addChatMessage('Main Agent: Routing to LogAgent sub-agent...', false, 'system');
                setTimeout(() => {
                    addChatMessage('LogAgent: Processing 147K entries/minute. All logs encrypted with hybrid protection. Compliance reports ready for SOC 2, ISO 27001.', false);
                }, 800);
            } else if (lowerCommand.includes('pause') && lowerCommand.includes('agent')) {
                showAgentShutdownModal();
            } else if (lowerCommand.includes('status')) {
                addChatMessage(`Main Agent: System Status
• AI Mode: ${agentActive ? 'Autonomous' : 'Manual Control'}
• Active Sub-Agents: 6
• Threat Level: Medium
• Encryption: Hybrid Active
• Uptime: 99.98%`, false);
            } else {
                addChatMessage('Main Agent: Command processed. Please specify which sub-agent or system you need: ThreatScanner, NetworkMapper, DefenseOrchestrator, EncryptionManager, AnalyticsEngine, or LogAgent.', false);
            }
        }, 500);
    }, 300);
}

function processCLICommand(command) {
    const lowerCommand = command.toLowerCase();
    
    // Show CLI mode indicator
    const cliIndicator = document.getElementById('cliModeIndicator');
    if (cliIndicator) {
        cliIndicator.classList.add('active');
    }
    
    // Process in CLI mode
    setTimeout(() => {
        if (lowerCommand.includes('help')) {
            addChatMessage(`CLI Mode Commands:
• list threats - Show active threats
• scan network - Display network devices
• show encryption - Encryption status
• view logs - Recent security events
• enable agent - Restore AI control
• status - System overview`, false);
        } else if (lowerCommand.includes('list threats')) {
            addChatMessage(`[CLI] Active Threats:
1. SQL Injection - /api/users - BLOCKED
2. DDoS Attack - Port 80 - MITIGATING
3. Port Scan - 185.*.*.* - MONITORED`, false);
        } else if (lowerCommand.includes('scan network')) {
            addChatMessage(`[CLI] Network Scan:
• Total Devices: 247
• Servers: 12
• Workstations: 189
• IoT Devices: 46
• Unknown: 0`, false);
        } else if (lowerCommand.includes('enable agent')) {
            agentActive = true;
            cliMode = false;
            if (cliIndicator) {
                cliIndicator.classList.remove('active');
            }
            addChatMessage('✅ Main Agent re-enabled. Autonomous mode restored.', false, 'system');
        } else {
            addChatMessage(`[CLI] Command executed: ${command}`, false);
        }
    }, 300);
}

// Simulate Main Agent connection issues
function simulateConnectionIssue() {
    if (Math.random() > 0.95 && agentActive) {
        cliMode = true;
        const cliIndicator = document.getElementById('cliModeIndicator');
        if (cliIndicator) {
            cliIndicator.classList.add('active');
        }
        
        // Update chat status
        const chatStatus = document.querySelector('.ai-chat-status span');
        if (chatStatus) {
            chatStatus.textContent = 'CLI MODE - MAIN AGENT OFFLINE';
        }
        
        addChatMessage('⚠️ Main Agent connection lost. Switching to CLI fallback mode. Type "help" for available commands.', false, 'system');
    }
}

// Check connection periodically
setInterval(simulateConnectionIssue, 30000);
