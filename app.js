/* ==========================================================================
   kochicode JavaScript Controller - Premium Interactive Components
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNavigation();
    initHeroTerminal();
    initServicesCarousel();
    initTechStackSelector();
    initSystemMetricsMock();
    initContactForms();
});

/* ==========================================================================
   1. Navigation & Scroll Interactions
   ========================================================================== */
function initNavigation() {
    const header = document.getElementById('main-header');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-btn');

    // Sticky Nav on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Toggle Mobile Menu
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });

    // Close Mobile Menu on Link Click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mobileNav.classList.remove('active');
        });
    });
}

/* ==========================================================================
   2. Hero Interactive CLI Terminal
   ========================================================================== */
function initHeroTerminal() {
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-user-input');
    const chips = document.querySelectorAll('.chip');
    
    // Command History
    let commandHistory = [];
    let historyIndex = -1;

    // Command responses database
    const commands = {
        help: () => {
            return `Available commands:
  <span class="cmd-highlight">about</span>        - Get to know kochicode's operational scope
  <span class="cmd-highlight">services</span>     - Inspect our specialized tech service modules
  <span class="cmd-highlight">tech-stack</span>   - Show the frameworks and layers we build on
  <span class="cmd-highlight">deploy-demo</span>  - Execute a live simulation of a cloud project deploy
  <span class="cmd-highlight">clear</span>        - Clear terminal history
  <span class="cmd-highlight">help</span>         - Display this active command ledger`;
        },
        about: () => {
            return `kochicode is a boutique software engineering house. We design premium scalable systems for modern enterprises, bridging high-throughput backend infrastructure with responsive, visually-stunning user layers. We write clean code, containerize our workloads, and design for peak workloads.`;
        },
        services: () => {
            return `Active Specialized Service Modules:
  1. <span class="cmd-highlight">Web & App Engineering</span>  [React, Next.js, WebGL]
  2. <span class="cmd-highlight">DevOps & Cloud Systems</span>  [Kubernetes, Terraform, AWS, GCP]
  3. <span class="cmd-highlight">Intelligent AI Pipelines</span> [RAG pipelines, VectorDBs, Agent Automations]`;
        },
        'tech-stack': () => {
            return `Engineering Ecosystem:
  - Frontend Layer  :: Next.js / React, Vanilla CSS, Tailwind, WebGL
  - Server Layer    :: Node.js / NestJS, Golang, Python FastAPI
  - Data Store      :: PostgreSQL, Redis, vector-databases (Pinecone, pgvector)
  - Infrastructure  :: Docker, Kubernetes, AWS Services, GitHub CI/CD, Terraform`;
        },
        tech: () => {
            return commands['tech-stack']();
        },
        clear: () => {
            terminalOutput.innerHTML = '';
            return '';
        }
    };

    // Simulated project compilation and deployment sequence!
    function executeDeployDemo(onLineCallback, onCompleteCallback) {
        const steps = [
            { text: 'system: Initializing dockerized sandbox ecosystem...', type: 'sys', delay: 400 },
            { text: 'system: Injecting kochicode production variables...', type: 'sys', delay: 300 },
            { text: 'system: Resolving microservice dependencies [32/32 resolved]', type: 'info', delay: 400 },
            { text: 'system: Building production asset bundles...', type: 'info', delay: 500 },
            { text: 'system: Running automated end-to-end integration tests...', type: 'info', delay: 400 },
            { text: 'system: [PASS] 48 tests succeeded / 0 failed', type: 'success', delay: 300 },
            { text: 'system: Deploying serverless containers to edge cluster...', type: 'sys', delay: 500 },
            { text: 'system: Configuring SSL protocols & load balancers...', type: 'sys', delay: 400 },
            { text: 'system: [DEPLOYS SUCCESSFUL] URL: <a href="#contact" class="cmd-highlight" style="text-decoration: underline;">https://kochicode-active-sandbox.live</a>', type: 'success', delay: 200 }
        ];

        let index = 0;
        
        function printNextStep() {
            if (index < steps.length) {
                const step = steps[index];
                let lineClass = 'terminal-line';
                let content = '';

                if (step.type === 'sys') {
                    content = `<span class="line-meta">system:</span> ${step.text.replace('system: ', '')}`;
                } else if (step.type === 'success') {
                    content = `<span class="line-meta" style="color:var(--accent-green)">[ SUCCESS ]</span> ${step.text.replace('system: ', '')}`;
                } else {
                    content = `<span class="line-meta" style="color:var(--accent-warn)">[ INFO ]</span> ${step.text.replace('system: ', '')}`;
                }

                const lineDiv = document.createElement('div');
                lineDiv.className = lineClass;
                lineDiv.innerHTML = content;
                terminalOutput.appendChild(lineDiv);
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
                
                index++;
                setTimeout(printNextStep, step.delay);
            } else {
                onCompleteCallback();
            }
        }

        printNextStep();
    }

    // Run Command Logic
    function runCommand(commandStr) {
        const cleanCommand = commandStr.trim().toLowerCase();
        
        // Append typed command to console
        const inputEchoLine = document.createElement('div');
        inputEchoLine.className = 'terminal-line';
        inputEchoLine.innerHTML = `<span class="prompt">kochicode@dev:~$</span> <span>${escapeHtml(commandStr)}</span>`;
        terminalOutput.appendChild(inputEchoLine);

        if (cleanCommand) {
            commandHistory.push(commandStr);
            historyIndex = commandHistory.length;

            if (cleanCommand === 'deploy-demo' || cleanCommand === 'deploy') {
                terminalInput.disabled = true;
                terminalInput.placeholder = 'Compiling deploy... please wait';
                
                // Disable chips
                chips.forEach(c => c.style.pointerEvents = 'none');

                executeDeployDemo(
                    () => {},
                    () => {
                        terminalInput.disabled = false;
                        terminalInput.placeholder = 'Type a command...';
                        chips.forEach(c => c.style.pointerEvents = 'auto');
                        appendPromptLine();
                    }
                );
                return; // Prevents printing regular response and immediate prompt
            } else if (commands[cleanCommand]) {
                const result = commands[cleanCommand]();
                if (result) {
                    const resultLine = document.createElement('div');
                    resultLine.className = 'terminal-line';
                    resultLine.innerHTML = result;
                    terminalOutput.appendChild(resultLine);
                }
            } else {
                const errorLine = document.createElement('div');
                errorLine.className = 'terminal-line';
                errorLine.innerHTML = `bash: command not found: <span style="color:var(--accent-violet)">${escapeHtml(cleanCommand)}</span>. Type <span class="cmd-highlight">help</span> to view lists.`;
                terminalOutput.appendChild(errorLine);
            }
        }

        appendPromptLine();
    }

    function appendPromptLine() {
        // Find existing cursor in terminal and remove it
        const oldCursor = terminalOutput.querySelector('.cursor');
        if (oldCursor) oldCursor.remove();

        const promptLine = document.createElement('div');
        promptLine.className = 'terminal-line';
        promptLine.innerHTML = `<span class="prompt">kochicode@dev:~$</span> <span class="cursor"></span>`;
        terminalOutput.appendChild(promptLine);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // Simulating Initial Typewriter Welcome Action
    const welcomeCommand = "help";
    let welcomeIndex = 0;
    const typedInitSpan = terminalOutput.querySelector('.typed-init');
    
    function typeInitialCommand() {
        if (welcomeIndex < welcomeCommand.length) {
            typedInitSpan.textContent += welcomeCommand.charAt(welcomeIndex);
            welcomeIndex++;
            setTimeout(typeInitialCommand, 150);
        } else {
            setTimeout(() => {
                // Erase typing prompt structure & execute
                typedInitSpan.parentElement.remove();
                runCommand(welcomeCommand);
            }, 500);
        }
    }

    // Trigger typewriter after brief delay
    setTimeout(typeInitialCommand, 1000);

    // Event listener for user inputs
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = terminalInput.value;
            terminalInput.value = '';
            runCommand(cmd);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                terminalInput.value = '';
            }
        }
    });

    // Chip buttons click handling
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const cmd = chip.getAttribute('data-cmd');
            // Animate typing into input field before triggering
            terminalInput.value = '';
            let charIndex = 0;
            terminalInput.focus();
            
            function animateChipType() {
                if (charIndex < cmd.length) {
                    terminalInput.value += cmd.charAt(charIndex);
                    charIndex++;
                    setTimeout(animateChipType, 50);
                } else {
                    setTimeout(() => {
                        terminalInput.value = '';
                        runCommand(cmd);
                    }, 150);
                }
            }
            animateChipType();
        });
    });
}

/* ==========================================================================
   3. Service Cards 3D Carousel
   ========================================================================== */
function initServicesCarousel() {
    const cards = document.querySelectorAll('.carousel-track .service-card');
    const btnPrev = document.querySelector('.prev-btn');
    const btnNext = document.querySelector('.next-btn');
    if (!cards.length) return;

    let currentIndex = 0;

    function updateCarousel() {
        cards.forEach((card, index) => {
            card.className = 'service-card'; // reset
            if (index === currentIndex) {
                card.classList.add('card-active');
            } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
                card.classList.add('card-prev');
            } else if (index === (currentIndex + 1) % cards.length) {
                card.classList.add('card-next');
            }
        });
    }

    btnPrev.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
    });

    btnNext.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    });
}

/* ==========================================================================
   4. Interactive Technology Stack Selector
   ========================================================================== */
function initTechStackSelector() {
    const nodes = document.querySelectorAll('.tech-node');
    const layers = document.querySelectorAll('.layer-card');

    // Helper to highlight active architectural layers based on node selection
    function highlightLayer(layerName) {
        layers.forEach(layer => {
            layer.classList.remove('highlighted', 'highlighted-purple');
            
            if (layer.id === `layer-${layerName}`) {
                if (layerName === 'cloud') {
                    layer.classList.add('highlighted-purple');
                } else {
                    layer.classList.add('highlighted');
                }
            }
        });
    }

    // Initialize default active layer state (Frontend)
    highlightLayer('frontend');

    nodes.forEach(node => {
        node.addEventListener('click', () => {
            // Update active state in tech node grid
            nodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');

            // Highlight corresponding detail card
            const layer = node.getAttribute('data-layer');
            highlightLayer(layer);
        });
    });
}

/* ==========================================================================
   5. About Section Metrics & Dashboard Visuals
   ========================================================================== */
function initSystemMetricsMock() {
    const bars = document.querySelectorAll('.graph-bar');
    const values = document.querySelectorAll('.graph-val');
    const logsContainer = document.querySelector('.console-logs');

    // Periodically update graph levels to simulate high-fidelity data feeds
    setInterval(() => {
        bars.forEach((bar, idx) => {
            const currentWidth = parseInt(bar.style.width);
            // Fluctuate around their current metrics slightly
            let fluctuation = Math.floor(Math.random() * 11) - 5; // -5 to +5
            let newWidth = currentWidth + fluctuation;
            newWidth = Math.max(10, Math.min(newWidth, 98)); // bound between 10% and 98%
            
            bar.style.width = `${newWidth}%`;
            values[idx].textContent = `${newWidth}%`;
        });

        // Add a mock diagnostic log line
        const logs = [
            '<span class="log-ok">[ OK ]</span> api_gateway successfully parsed upstream request',
            '<span class="log-ok">[ OK ]</span> load_balancer node 3 connection pooled',
            '<span class="log-warn">[ INFO ]</span> db_replica synchronized (+0.02ms sync lag)',
            '<span class="log-ok">[ OK ]</span> secure_session generated for client_ip_handshake'
        ];
        
        const randomLog = logs[Math.floor(Math.random() * logs.length)];
        const logLine = document.createElement('div');
        logLine.className = 'log-line';
        logLine.innerHTML = randomLog;
        
        logsContainer.appendChild(logLine);
        
        // Cap lines at 5 to prevent scroll clutter
        if (logsContainer.children.length > 5) {
            logsContainer.children[0].remove();
        }
    }, 4000);
}

/* ==========================================================================
   kochicode Main Application Logic
   ========================================================================== */

// Force scroll to top on page refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

/* ==========================================================================
   6. Onboarding Dual-Mode Forms
   ========================================================================== */
function initContactForms() {
    // Mode triggers
    const btnStandard = document.getElementById('btn-mode-standard');
    const btnTerminal = document.getElementById('btn-mode-terminal');
    
    // Panel interfaces
    const standardForm = document.getElementById('standard-contact-form');
    const terminalForm = document.getElementById('terminal-contact-form');
    const successState = document.getElementById('form-success-state');
    
    // Reset / Success button
    const btnReset = document.getElementById('btn-form-reset');

    // ==========================================
    // Web3Forms API Integration
    // ==========================================
    // TODO: Paste your Web3Forms Access Key here:
    const WEB3FORMS_ACCESS_KEY = '1b9db549-09e2-456a-9752-de6a64f9c2cf';

    async function sendToWeb3Forms(data, onSuccess, onError) {
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ access_key: WEB3FORMS_ACCESS_KEY, ...data })
            });
            const result = await response.json();
            if (response.status == 200) {
                onSuccess();
            } else {
                console.error(result);
                if (onError) onError();
            }
        } catch (error) {
            console.error(error);
            if (onError) onError();
        }
    }

    // Active Toggle states
    btnStandard.addEventListener('click', () => {
        btnStandard.classList.add('active');
        btnTerminal.classList.remove('active');
        
        successState.classList.remove('active-form');
        terminalForm.classList.remove('active-form');
        standardForm.classList.add('active-form');
    });

    btnTerminal.addEventListener('click', () => {
        btnTerminal.classList.add('active');
        btnStandard.classList.remove('active');
        
        successState.classList.remove('active-form');
        standardForm.classList.remove('active-form');
        terminalForm.classList.add('active-form');
        
        // Fire Terminal Wizard Engine
        startTerminalWizard();
    });

    // Handle standard form submit
    standardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const data = {
            name: document.getElementById('client-name').value,
            email: document.getElementById('client-email').value,
            scale: document.getElementById('project-type').value,
            summary: document.getElementById('client-msg').value,
            subject: 'New kochicode Standard Form Submission'
        };

        const submitBtn = document.getElementById('btn-form-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Transmitting...</span>';

        sendToWeb3Forms(data, () => {
            standardForm.classList.remove('active-form');
            successState.classList.add('active-form');
            submitBtn.innerHTML = originalText;
            standardForm.reset();
        }, () => {
            alert("Oops! The transmission failed. Check your access key or connection.");
            submitBtn.innerHTML = originalText;
        });
    });

    // Reset workflow
    btnReset.addEventListener('click', () => {
        // Reset HTML forms
        standardForm.reset();
        
        // Back to standard mode default
        btnStandard.click();
    });

    /* --- CLI Onboarding Wizard State Machine --- */
    let wizardStep = 1;
    let wizardData = {
        name: '',
        email: '',
        scale: '',
        summary: ''
    };

    const wizardOutput = document.getElementById('wizard-terminal-output');
    const wizardInput = document.getElementById('wizard-user-input');
    const wizardInputPrompt = document.querySelector('.wizard-prompt');
    const shortcutsPanel = document.getElementById('wizard-shortcuts-panel');

    function startTerminalWizard() {
        wizardStep = 1;
        wizardData = { name: '', email: '', scale: '', summary: '' };
        wizardOutput.innerHTML = `
            <div class="wizard-line"><span class="w-accent">[$]</span> Launching kochicode onboarding wizard v1.4...</div>
            <div class="wizard-line"><span class="w-accent">[$]</span> Step 1: What is your name?</div>
        `;
        wizardInputPrompt.textContent = 'name >';
        wizardInput.value = '';
        wizardInput.disabled = false;
        wizardInput.placeholder = 'Type your name...';
        shortcutsPanel.innerHTML = '';
        wizardInput.focus();
    }

    function processWizardStep(inputVal) {
        const cleanInput = inputVal.trim();
        if (!cleanInput) return;

        // Echo response in terminal
        const echoDiv = document.createElement('div');
        echoDiv.className = 'wizard-line';
        echoDiv.innerHTML = `<span class="wizard-prompt">${wizardInputPrompt.textContent}</span> <span class="w-input-echo">${escapeHtml(cleanInput)}</span>`;
        wizardOutput.appendChild(echoDiv);
        wizardOutput.scrollTop = wizardOutput.scrollHeight;

        if (wizardStep === 1) {
            // Save Name -> Move to Email
            wizardData.name = cleanInput;
            wizardStep = 2;
            
            setTimeout(() => {
                const nextDiv = document.createElement('div');
                nextDiv.className = 'wizard-line';
                nextDiv.innerHTML = `<span class="w-accent">[$]</span> Step 2: What is your email address?`;
                wizardOutput.appendChild(nextDiv);
                wizardInputPrompt.textContent = 'email >';
                wizardInput.value = '';
                wizardInput.placeholder = 'you@example.com';
                wizardOutput.scrollTop = wizardOutput.scrollHeight;
            }, 300);

        } else if (wizardStep === 2) {
            // Validate Email roughly
            if (!cleanInput.includes('@') || !cleanInput.includes('.')) {
                setTimeout(() => {
                    const errDiv = document.createElement('div');
                    errDiv.className = 'wizard-line';
                    errDiv.innerHTML = `<span style="color:var(--accent-violet)">[ERROR]</span> Invalid email format. Please supply a valid address:`;
                    wizardOutput.appendChild(errDiv);
                    wizardInput.value = '';
                    wizardOutput.scrollTop = wizardOutput.scrollHeight;
                }, 200);
                return;
            }

            wizardData.email = cleanInput;
            wizardStep = 3;

            setTimeout(() => {
                const nextDiv = document.createElement('div');
                nextDiv.className = 'wizard-line';
                nextDiv.innerHTML = `<span class="w-accent">[$]</span> Step 3: Select your project architecture scope:`;
                wizardOutput.appendChild(nextDiv);
                
                wizardInputPrompt.textContent = 'scope >';
                wizardInput.value = '';
                wizardInput.placeholder = 'Type choice or click chips...';
                
                // Render project category chips for ease of onboarding
                shortcutsPanel.innerHTML = `
                    <button class="wizard-chip">SaaS Web App</button>
                    <button class="wizard-chip">Cloud Scaling</button>
                    <button class="wizard-chip">Intelligent AI</button>
                    <button class="wizard-chip">Full System Core</button>
                `;
                
                // Add click events to wizard chips
                const wChips = shortcutsPanel.querySelectorAll('.wizard-chip');
                wChips.forEach(wc => {
                    wc.addEventListener('click', () => {
                        wizardInput.value = wc.textContent;
                        processWizardStep(wc.textContent);
                    });
                });

                wizardOutput.scrollTop = wizardOutput.scrollHeight;
            }, 300);

        } else if (wizardStep === 3) {
            // Save Scope -> Move to Summary
            wizardData.scale = cleanInput;
            wizardStep = 4;

            setTimeout(() => {
                shortcutsPanel.innerHTML = ''; // clear chips
                const nextDiv = document.createElement('div');
                nextDiv.className = 'wizard-line';
                nextDiv.innerHTML = `<span class="w-accent">[$]</span> Step 4: Describe what you would like to build:`;
                wizardOutput.appendChild(nextDiv);
                wizardInputPrompt.textContent = 'summary >';
                wizardInput.value = '';
                wizardInput.placeholder = 'Build requirements...';
                wizardOutput.scrollTop = wizardOutput.scrollHeight;
            }, 300);

        } else if (wizardStep === 4) {
            // Save Summary -> Compiling / Injecting!
            wizardData.summary = cleanInput;
            wizardStep = 5;
            
            wizardInput.value = '';
            wizardInput.disabled = true;
            wizardInputPrompt.textContent = 'sys >';
            wizardInput.placeholder = 'Processing payload...';

            setTimeout(() => {
                const packLine = document.createElement('div');
                packLine.className = 'wizard-line';
                packLine.innerHTML = `<span class="w-accent">[$]</span> Compiling onboarding manifest... [OK]`;
                wizardOutput.appendChild(packLine);
                wizardOutput.scrollTop = wizardOutput.scrollHeight;
            }, 300);

            setTimeout(() => {
                const encryptLine = document.createElement('div');
                encryptLine.className = 'wizard-line';
                encryptLine.innerHTML = `<span class="w-accent">[$]</span> Encrypting payload metadata... [OK]`;
                wizardOutput.appendChild(encryptLine);
                wizardOutput.scrollTop = wizardOutput.scrollHeight;
            }, 700);

            setTimeout(() => {
                const injectLine = document.createElement('div');
                injectLine.className = 'wizard-line';
                injectLine.innerHTML = `<span class="w-accent">[$]</span> Transmitting to external network...`;
                wizardOutput.appendChild(injectLine);
                wizardOutput.scrollTop = wizardOutput.scrollHeight;
                
                wizardData.subject = 'New kochicode Terminal CLI Submission';
                
                sendToWeb3Forms(wizardData, () => {
                    const successLine = document.createElement('div');
                    successLine.className = 'wizard-line';
                    successLine.innerHTML = `<span style="color: #10B981;">[SUCCESS] Transmission verified.</span>`;
                    wizardOutput.appendChild(successLine);
                    wizardOutput.scrollTop = wizardOutput.scrollHeight;
                    
                    setTimeout(() => {
                        terminalForm.classList.remove('active-form');
                        successState.classList.add('active-form');
                    }, 1200);
                }, () => {
                    const errorLine = document.createElement('div');
                    errorLine.className = 'wizard-line';
                    errorLine.innerHTML = `<span style="color: #F59E0B;">[ERROR] Network rejection. Try again.</span>`;
                    wizardOutput.appendChild(errorLine);
                    wizardOutput.scrollTop = wizardOutput.scrollHeight;
                    wizardInput.disabled = false;
                    wizardStep = 4; // Reset to allow retry
                });
            }, 1200);
        }
    }

    wizardInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            processWizardStep(wizardInput.value);
        }
    });
}

/* ==========================================================================
   7. Scroll Animations (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Create the observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before the element fully enters
        threshold: 0.1 // 10% of element must be visible
    });
    
    // Observe all elements
    animatedElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Helper Utilities
   ========================================================================== */
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
