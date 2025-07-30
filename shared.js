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

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    initNeuralBackground();
});

// AI Chat functionality
function toggleChat() {
    chatOpen = !chatOpen;
    const chatWindow = document.getElementById('aiChatWindow');
    if (chatWindow) {
        if (chatOpen) {
            chatWindow.classList.add('active');
        } else {
            chatWindow.classList.remove('active');
        }
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
    if (!messagesContainer) return;
    
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
                    addChatMessage('DefenseOrchestrator: 8 honeypots active. Automated response enabled. Last action: Blocked 45K malicious requests. All actions logged with quantum-resistant signatures.', false);
                }, 800);
            } else if (lowerCommand.includes('log') || lowerCommand.includes('audit')) {
                addChatMessage('Main Agent: Routing to LogAgent sub-agent...', false, 'system');
                setTimeout(() => {
                    addChatMessage('LogAgent: Processing 147K entries/minute. All logs encrypted with hybrid protection. Compliance reports ready for SOC 2, ISO 27001.', false);
                }, 800);
            } else if (lowerCommand.includes('analytics') || lowerCommand.includes('report')) {
                addChatMessage('Main Agent: Routing to AnalyticsEngine sub-agent...', false, 'system');
                setTimeout(() => {
                    addChatMessage('AnalyticsEngine: Real-time threat analysis shows 78% phishing increase. ML model accuracy: 99.8%. All data protected with AES-256-GCM + Kyber-1024.', false);
                }, 800);
            } else if (lowerCommand.includes('pause') && lowerCommand.includes('agent')) {
                showAgentShutdownModal();
            } else if (lowerCommand.includes('quarantine')) {
                const ipMatch = command.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
                if (ipMatch) {
                    addChatMessage(`Main Agent: Quarantining IP ${ipMatch[1]}...`, false, 'system');
                    setTimeout(() => {
                        addChatMessage(`DefenseOrchestrator: IP ${ipMatch[1]} has been quarantined. All traffic blocked. Action logged with Dilithium-3 signature.`, false);
                    }, 1000);
                } else {
                    addChatMessage('Main Agent: Please specify an IP address to quarantine. Example: quarantine 192.168.1.105', false);
                }
            } else if (lowerCommand.includes('status')) {
                addChatMessage(`Main Agent: System Status
• AI Mode: ${agentActive ? 'Autonomous' : 'Manual Control'}
• Active Sub-Agents: 6
• Threat Level: Medium
• Encryption: Hybrid Active (Classical + Quantum)
• Uptime: 99.98%
• Protected Devices: 247
• Active Threats: 7`, false);
            } else if (lowerCommand.includes('help')) {
                addChatMessage(`Main Agent: Available commands:
• status - View system status
• list threats - Show active threats
• scan network - Network discovery status
• show encryption - Encryption details
• quarantine [IP] - Block specific IP
• pause ai agent - Switch to manual mode
• view logs - Recent security events
• analytics report - Threat analytics

All actions are routed through appropriate sub-agents.`, false);
            } else {
                addChatMessage('Main Agent: Command processed. Specify which sub-agent or system you need: ThreatScanner, NetworkMapper, DefenseOrchestrator, EncryptionManager, AnalyticsEngine, or LogAgent.', false);
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
• quarantine [IP] - Block IP address
• enable agent - Restore AI control
• status - System overview`, false);
        } else if (lowerCommand.includes('list threats')) {
            addChatMessage(`[CLI] Active Threats:
1. SQL Injection - /api/users - BLOCKED
2. DDoS Attack - Port 80 - MITIGATING  
3. Port Scan - 185.*.*.* - MONITORED
4. Brute Force - SSH - RATE LIMITED
5. Malware C2 - ISOLATED`, false);
        } else if (lowerCommand.includes('scan network')) {
            addChatMessage(`[CLI] Network Scan:
• Total Devices: 247
• Servers: 12
• Workstations: 189
• IoT Devices: 46
• Unknown: 0
• New (24h): 12`, false);
        } else if (lowerCommand.includes('show encryption')) {
            addChatMessage(`[CLI] Encryption Status:
Classical Layer:
• AES-256-GCM: ACTIVE
• HMAC-SHA256: ACTIVE
• PBKDF2: ACTIVE (600K iterations)
• HKDF-SHA256: ACTIVE

Post-Quantum Layer:
• CRYSTALS-Kyber: ACTIVE (Level 5)
• CRYSTALS-Dilithium: ACTIVE (Level 3)
• SPHINCS+: ACTIVE
• FALCON: TESTING`, false);
        } else if (lowerCommand.includes('view logs')) {
            addChatMessage(`[CLI] Recent Events:
[${new Date().toLocaleTimeString()}] Threat blocked - SQL injection
[${new Date().toLocaleTimeString()}] Key rotation completed
[${new Date().toLocaleTimeString()}] New device: 192.168.1.247
[${new Date().toLocaleTimeString()}] Honeypot triggered
[${new Date().toLocaleTimeString()}] All logs Dilithium signed`, false);
        } else if (lowerCommand.includes('quarantine')) {
            const ipMatch = command.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
            if (ipMatch) {
                addChatMessage(`[CLI] Quarantining ${ipMatch[1]}... Done.`, false);
            } else {
                addChatMessage(`[CLI] Usage: quarantine [IP address]`, false);
            }
        } else if (lowerCommand.includes('enable agent')) {
            agentActive = true;
            cliMode = false;
            if (cliIndicator) {
                cliIndicator.classList.remove('active');
            }
            addChatMessage('✅ Main Agent re-enabled. Autonomous mode restored.', false, 'system');
            
            // Update agent status in header if exists
            const agentStatus = document.querySelector('.agent-status');
            if (agentStatus) {
                agentStatus.style.background = 'rgba(0, 255, 136, 0.1)';
                agentStatus.style.borderColor = '#00ff88';
                
                const statusTitle = document.querySelector('.agent-title');
                const statusText = document.querySelector('.agent-status-text');
                if (statusTitle) {
                    statusTitle.textContent = 'AI Agent Active';
                    statusTitle.style.color = '#00ff88';
                }
                if (statusText) {
                    statusText.textContent = 'Fully Autonomous';
                }
            }
        } else if (lowerCommand.includes('status')) {
            addChatMessage(`[CLI] System Status:
• Mode: CLI (Manual Control)
• Threats: 7 active
• Devices: 247 protected
• Encryption: Hybrid Active
• Uptime: 99.98%`, false);
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

// Typing indicator functions
function showTypingIndicator() {
    const messagesContainer = document.getElementById('aiChatMessages');
    if (!messagesContainer) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-typing';
    typingDiv.id = 'typingIndicator';
    typingDiv.style.display = 'flex';
    typingDiv.style.gap = '5px';
    typingDiv.style.padding = '10px';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.style.width = '8px';
        dot.style.height = '8px';
        dot.style.background = 'var(--primary)';
        dot.style.borderRadius = '50%';
        dot.style.animation = 'typingDot 1.4s ease-in-out infinite';
        dot.style.animationDelay = `${i * 0.2}s`;
        typingDiv.appendChild(dot);
    }
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// Add CSS animation for typing dots
const style = document.createElement('style');
style.textContent = `
    @keyframes typingDot {
        0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
        }
        30% {
            transform: translateY(-10px);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Agent Shutdown Modal functions
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
        
        const statusTitle = document.querySelector('.agent-title');
        const statusText = document.querySelector('.agent-status-text');
        if (statusTitle) {
            statusTitle.textContent = 'AI Agent Paused';
            statusTitle.style.color = '#ffaa00';
        }
        if (statusText) {
            statusText.textContent = 'Manual Control Only';
        }
    }
    
    closeModal();
    
    // Show notification in chat
    if (chatOpen) {
        addChatMessage('⚠️ Main Agent has been paused. Manual control is now active. I will operate in local CLI mode if external connections fail.', false, 'system');
    }
    
    // Add to security feed if exists
    if (typeof addFeedItem === 'function') {
        addFeedItem('⚠️ AI Agent switched to manual control mode', 'warning', 'Main Agent');
    }
}

// Generate AI response for specific pages
function generateAIResponse(message, context = 'general') {
    const lowerMessage = message.toLowerCase();
    
    // Context-specific responses
    switch(context) {
        case 'threats':
            if (lowerMessage.includes('ddos')) {
                return '⚡ The DDoS attack is being handled by rate limiting and traffic filtering. Current mitigation: 94% effective. Blocking 45,892 requests/second. All logs encrypted with AES-256-GCM + Kyber-1024.';
            }
            if (lowerMessage.includes('sql')) {
                return '🛡️ SQL injection attempts detected on /api/users endpoint. Pattern matches known exploits. All attempts blocked and logged with Dilithium-3 signatures for forensic analysis.';
            }
            break;
            
        case 'network':
            if (lowerMessage.includes('scan') || lowerMessage.includes('discover')) {
                return '📡 Network discovery is fully autonomous. The agent uses ARP scanning, service fingerprinting, and behavioral analysis. All communications use hybrid encryption. New devices detected within 0.3 seconds.';
            }
            break;
            
        case 'encryption':
            if (lowerMessage.includes('quantum')) {
                return '🔮 Post-quantum algorithms protect against future quantum computers: CRYSTALS-Kyber-1024 for key encapsulation, CRYSTALS-Dilithium-3 for signatures, SPHINCS+-256s for long-term archival.';
            }
            break;
    }
    
    // General responses
    if (lowerMessage.includes('help')) {
        return generateHelpResponse(context);
    }
    
    if (lowerMessage.includes('status')) {
        return generateStatusResponse(context);
    }
    
    return '🤖 Processing your request. Please specify what you need assistance with or type "help" for available commands.';
}

function generateHelpResponse(context) {
    return `Available commands:
• status - View system status
• list threats - Show active threats
• show encryption - Encryption details
• scan network - Network status
• view logs - Recent events
• help - This message

Context: ${context} module`;
}

function generateStatusResponse(context) {
    return `System Status:
• AI Mode: ${agentActive ? 'Autonomous' : 'Manual'}
• Module: ${context}
• Encryption: Hybrid Active
• Performance: Optimal`;
}
