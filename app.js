document.body.style.overflow = 'hidden';
/* ==========================================================================
   kochicode JavaScript Controller - Premium Interactive Components
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initLoadingSequence();
    initNavigation();
    initGrainient();
    initCrowdAnimation();
    initGlassLens();
    initInfiniteMenu();
    initServicesCarousel();
    initTechStackSelector();
    initSystemMetricsMock();
    initContactForms();
});


/* ==========================================================================
   0. Loading Screen & Hero Sequence
   ========================================================================== */
function initLoadingSequence() {
    window.addEventListener('load', () => {
        const loadingScreen = document.getElementById('loading-screen');
        const heroSequence = document.getElementById('hero-sequence');
        const navWrapper = document.getElementById('nav-wrapper');

        // Step 1: Hold loading screen for a moment
        setTimeout(() => {
            // Fade out loading screen
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
            }

            // Fade in Hero Sequence
            if (heroSequence) {
                heroSequence.classList.add('visible');
            }

            // Step 2: Show navbar after hero settles
            setTimeout(() => {
                if (navWrapper) {
                    navWrapper.classList.add('visible');
                }
                // Unlock scrolling
                document.body.style.overflow = '';
            }, 800);

        }, 500);
    });
}

/* ==========================================================================
   1. Navigation & Scroll Interactions
   ========================================================================== */
function initNavigation() {
    const glassPill = document.getElementById('glass-pill');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-btn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            glassPill.classList.add('scrolled');
        } else {
            glassPill.classList.remove('scrolled');
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
   2. Grainient Hero Background
   ========================================================================== */
function initGrainient() {
    const container = document.getElementById('grainient-container');
    if (!container) return;

    // Configuration from the React props
    const config = {
        timeSpeed: 0.15,
        warpStrength: 0.4,
        warpFrequency: 5.0,
        warpSpeed: 2.0,
        warpAmplitude: 25.0,
        blendAngle: 0.0,
        blendSoftness: 0.05,
        rotationAmount: 500.0,
        noiseScale: 2.0,
        grainAmount: 0.03,
        grainScale: 2.0,
        grainAnimated: 0.0,
        contrast: 1.0,
        colorBalance: 0.4,
        saturation: 0.85,
        centerX: 0.0,
        centerY: 0.0,
        zoom: 1.1,
        color1: '#FFFFFF',
        color2: '#0060BF',
        color3: '#32A15D'
    };

    const hexToRgb = hex => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return [1, 1, 1];
        return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
    };

    const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

    const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);} 
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);} 
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}
void mainImage(out vec4 o, vec2 C){
  float t=iTime*uTimeSpeed;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);

  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;

  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);

  vec3 colLav=uColor1;
  vec3 colOrg=uColor2;
  vec3 colDark=uColor3;
  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  mat2 blendRot=Rot(radians(uBlendAngle));
  float blendX=(tuv*blendRot).x;
  float edge0=-0.3-b-s;
  float edge1=0.2-b+s;
  float v0=0.5-b+s;
  float v1=-0.3-b-s;
  vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));
  vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));

  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);} 
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;

  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  col=clamp(col,0.0,1.0);

  o=vec4(col,1.0);
}
void main(){
  vec4 o=vec4(0.0);
  mainImage(o,gl_FragCoord.xy);
  fragColor=o;
}
`;

    import('https://cdn.jsdelivr.net/npm/ogl@1.0.11/+esm').then(({ Renderer, Program, Mesh, Triangle }) => {
        const renderer = new Renderer({
            webgl: 2,
            alpha: true,
            antialias: false,
            dpr: Math.min(window.devicePixelRatio || 1, 2)
        });

        const gl = renderer.gl;
        const canvas = gl.canvas;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        container.appendChild(canvas);

        const geometry = new Triangle(gl);
        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                iTime:           { value: 0 },
                iResolution:     { value: new Float32Array([1, 1]) },
                uTimeSpeed:      { value: config.timeSpeed },
                uColorBalance:   { value: config.colorBalance },
                uWarpStrength:   { value: config.warpStrength },
                uWarpFrequency:  { value: config.warpFrequency },
                uWarpSpeed:      { value: config.warpSpeed },
                uWarpAmplitude:  { value: config.warpAmplitude },
                uBlendAngle:     { value: config.blendAngle },
                uBlendSoftness:  { value: config.blendSoftness },
                uRotationAmount: { value: config.rotationAmount },
                uNoiseScale:     { value: config.noiseScale },
                uGrainAmount:    { value: config.grainAmount },
                uGrainScale:     { value: config.grainScale },
                uGrainAnimated:  { value: config.grainAnimated },
                uContrast:       { value: config.contrast },
                uGamma:          { value: config.gamma },
                uSaturation:     { value: config.saturation },
                uCenterOffset:   { value: new Float32Array([config.centerX, config.centerY]) },
                uZoom:           { value: config.zoom },
                uColor1:         { value: new Float32Array(hexToRgb(config.color1)) },
                uColor2:         { value: new Float32Array(hexToRgb(config.color2)) },
                uColor3:         { value: new Float32Array(hexToRgb(config.color3)) }
            }
        });

        const mesh = new Mesh(gl, { geometry, program });

        const setSize = () => {
            const rect = container.getBoundingClientRect();
            const w = Math.max(1, Math.floor(rect.width));
            const h = Math.max(1, Math.floor(rect.height));
            renderer.setSize(w, h);
            const res = program.uniforms.iResolution.value;
            res[0] = gl.drawingBufferWidth;
            res[1] = gl.drawingBufferHeight;
            renderer.render({ scene: mesh });
        };

        const ro = new ResizeObserver(setSize);
        ro.observe(container);
        setSize();

        let raf = 0;
        let isVisible = true;
        let isPageVisible = !document.hidden;
        const t0 = performance.now();

        const loop = t => {
            program.uniforms.iTime.value = (t - t0) * 0.001;
            renderer.render({ scene: mesh });
            raf = requestAnimationFrame(loop);
        };

        const tryStart = () => {
            if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop);
        };
        const tryStop = () => {
            if (raf !== 0) { cancelAnimationFrame(raf); raf = 0; }
        };

        const io = new IntersectionObserver(
            ([entry]) => { isVisible = entry.isIntersecting; isVisible ? tryStart() : tryStop(); },
            { threshold: 0 }
        );
        io.observe(container);

        const onVisibility = () => {
            isPageVisible = !document.hidden;
            isPageVisible ? tryStart() : tryStop();
        };
        document.addEventListener('visibilitychange', onVisibility);

        tryStart();
    }).catch(err => console.error("Failed to load ogl:", err));
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
    if (btnStandard && btnTerminal) {
        btnStandard.addEventListener('click', () => {
            btnStandard.classList.add('active');
            btnTerminal.classList.remove('active');
            
            successState.classList.remove('active-form');
            if (terminalForm) terminalForm.classList.remove('active-form');
            standardForm.classList.add('active-form');
        });

        btnTerminal.addEventListener('click', () => {
            btnTerminal.classList.add('active');
            btnStandard.classList.remove('active');
            
            successState.classList.remove('active-form');
            standardForm.classList.remove('active-form');
            if (terminalForm) terminalForm.classList.add('active-form');
            
            // Fire Terminal Wizard Engine
            if (typeof startTerminalWizard === 'function') startTerminalWizard();
        });
    }

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

    if (wizardInput) {
        wizardInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                processWizardStep(wizardInput.value);
            }
        });
    }
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

/* ==========================================================================
   2.5. Stand Out — Scroll-Driven Canvas Crowd Animation
   ========================================================================== */
function initCrowdAnimation() {
    const canvas  = document.getElementById('c');
    const ctx     = canvas.getContext('2d');
    const section = document.getElementById('scrollSection');
    const line1   = document.getElementById('line1');
    const line2   = document.getElementById('line2');
    if (!section || !canvas) return;

    let W = 0, H = 0;
    let FX = 0, FY = 0; // focal point for hero + crowd convergence
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
        W  = canvas.offsetWidth;
        H  = canvas.offsetHeight;
        FX = W / 2;
        FY = H / 2; // true center — the hero converges HERE over the course of the scroll,
                     // he does not start here
        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildCrowd();
    }

    /* ── minimal figure: flat capsule silhouette, no limbs ── */
    function drawFigure(x, y, scale, color, alpha) {
        if (alpha <= 0.002) return;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        ctx.beginPath();
        ctx.arc(0, -21, 7.5, 0, Math.PI * 2);
        ctx.fill();

        roundRect(-11, -11, 22, 30, 11);

        ctx.restore();
    }

    function roundRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y,     x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x,     y + h, r);
        ctx.arcTo(x,     y + h, x,     y,     r);
        ctx.arcTo(x,     y,     x + w, y,     r);
        ctx.closePath();
        ctx.fill();
    }

    /* ── color interpolation for a smooth grey → brand-green bleed ── */
    function lerpColor(t) {
        const g0 = [150, 150, 150];
        const g1 = [50, 161, 93]; // #32A15D
        const r = Math.round(lerp(g0[0], g1[0], t));
        const gr = Math.round(lerp(g0[1], g1[1], t));
        const b = Math.round(lerp(g0[2], g1[2], t));
        return `rgb(${r},${gr},${b})`;
    }

    /* ── crowd ── */
    let crowd = [], hero = null;

    function buildCrowd() {
        crowd = [];
        const cols = 12, rows = 8;
        const marginX = W * 0.08, marginY = H * 0.1;
        const usableW = W - marginX * 2, usableH = H * 0.78;
        const sx = usableW / cols, sy = usableH / rows;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const bx = marginX + c * sx + sx * 0.5 + (Math.random() - 0.5) * sx * 0.4;
                const by = marginY + r * sy + sy * 0.5 + (Math.random() - 0.5) * sy * 0.35;
                const dx = bx - FX, dy = by - FY;
                crowd.push({
                    bx, by, cx: bx, cy: by,
                    angle: Math.atan2(dy, dx),
                    scale: 0.55 + Math.random() * 0.2,
                    baseAlpha: 0.5 + Math.random() * 0.25,
                    scatterMult: 0.7 + Math.random() * 0.6,
                    isHero: false,
                });
            }
        }

        // pick a hero from a mid-ring of the crowd (not dead-center, not edge) so his
        // walk to the true center is clearly visible rather than a subtle nudge
        let bestIdx = 0, bestDiff = Infinity;
        const targetDist = Math.min(W, H) * 0.16;
        crowd.forEach((pn, i) => {
            const d = Math.hypot(pn.bx - FX, pn.by - FY);
            const diff = Math.abs(d - targetDist);
            if (diff < bestDiff) { bestDiff = diff; bestIdx = i; }
        });
        crowd[bestIdx].isHero = true;
        hero = crowd[bestIdx];
        // hero keeps his natural grid spawn (bx, by) — he starts as one of the crowd
        // and travels to FX, FY over the scroll, he does not teleport there
    }

    /* ── scroll ── */
    let p = 0;
    function onScroll() {
        const rect  = section.getBoundingClientRect();
        const total = section.offsetHeight - window.innerHeight;
        p = Math.max(0, Math.min(1, -rect.top / total));
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const lerp  = (a, b, t)   => a + (b - a) * t;

    // IMPORTANT: always clamp t to [0,1] BEFORE easing, never after.
    // easeIO squares its input, so a negative t (phase not started yet)
    // becomes positive and can wrongly evaluate as "complete".
    const easeOut = t => { t = clamp(t, 0, 1); return 1 - Math.pow(1 - t, 3); };
    const easeIO  = t => { t = clamp(t, 0, 1); return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; };

    /* ── loop ── */
    let animT = 0, last = performance.now();

    function frame(ts) {
        requestAnimationFrame(frame);
        const dt = Math.min((ts - last) / 1000, 0.05);
        last = ts; animT += dt;

        // phase windows (each fed through clamp-then-ease, so it's inert until its window opens)
        const scatterP = easeOut((p - 0.05) / 0.40); // 0.05–0.45
        const dimP     = easeOut((p - 0.05) / 0.35); // 0.05–0.40
        const glowP    = easeIO ((p - 0.32) / 0.34); // 0.32–0.66  — smooth grey→green bleed

        // text: line 1 fully gone before line 2 starts, cinematic blur/scale reveal
        const l1In  = easeOut((p - 0.02) / 0.14);
        const l1Out = easeOut((p - 0.30) / 0.10);
        const l1Alpha = l1In * (1 - l1Out);

        const l2In  = easeOut((p - 0.44) / 0.18);
        const l2Alpha = l2In;

        line1.style.opacity = l1Alpha;
        line1.style.transform = `translateY(${lerp(28, 0, l1In) - lerp(0, -20, l1Out)}px) scale(${lerp(0.96, 1, l1In)})`;
        line1.style.filter = `blur(${lerp(6, 0, l1In) + lerp(0, 4, l1Out)}px)`;

        line2.style.opacity = l2Alpha;
        line2.style.transform = `translateY(${lerp(28, 0, l2In)}px) scale(${lerp(0.94, 1, l2In)})`;
        line2.style.filter = `blur(${lerp(6, 0, l2In)}px)`;

        // subtle cinematic dolly-in on the whole canvas as the story progresses
        canvas.style.transform = `scale(${lerp(1, 1.045, easeOut(p / 1))})`;

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, W, H);

        // hero's walk to center — slightly delayed/slower than the crowd's scatter so the
        // eye reads it as "everyone else leaves, then he steps forward", not simultaneous
        const centerP = easeOut((p - 0.08) / 0.42);

        const maxS = Math.max(W, H) * 0.55;
        for (const pn of crowd) {
            if (pn.isHero) {
                const tx = lerp(pn.bx, FX, centerP);
                const ty = lerp(pn.by, FY, centerP);
                pn.cx = lerp(pn.cx, tx, 0.06);
                pn.cy = lerp(pn.cy, ty, 0.06);
                continue;
            }
            const tx = pn.bx + Math.cos(pn.angle) * scatterP * maxS * pn.scatterMult;
            const ty = pn.by + Math.sin(pn.angle) * scatterP * maxS * pn.scatterMult;
            pn.cx = lerp(pn.cx, tx, 0.08);
            pn.cy = lerp(pn.cy, ty, 0.08);
        }

        const sorted = [...crowd].sort((a, b) => a.cy - b.cy);
        for (const pn of sorted) {
            if (pn.isHero) continue;
            const grey = Math.floor(lerp(150, 232, dimP));
            drawFigure(pn.cx, pn.cy, pn.scale, `rgb(${grey},${grey},${grey})`, lerp(pn.baseAlpha, 0.10, dimP));
        }

        const hx = hero.cx, hy = hero.cy;

        if (glowP > 0.001) {
            [[170, 0.07], [100, 0.16]].forEach(([r, a]) => {
                const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, r * (0.5 + glowP * 0.5));
                g.addColorStop(0, `rgba(50,161,93,${a * glowP})`);
                g.addColorStop(1, 'rgba(50,161,93,0)');
                ctx.beginPath(); ctx.arc(hx, hy, r, 0, Math.PI * 2);
                ctx.fillStyle = g; ctx.fill();
            });
        }

        // gentle idle breathing once the hero has come alive, for a living, cinematic quality
        const breathe = Math.sin(animT * 1.1) * 0.02 * glowP;
        const heroScale = lerp(0.6, 1.08, centerP) + breathe;
        drawFigure(hx, hy, heroScale, lerpColor(glowP), 1);

        const vg = ctx.createRadialGradient(hx, hy, H * 0.22, hx, hy, H * 0.78);
        vg.addColorStop(0, 'rgba(255,255,255,0)');
        vg.addColorStop(1, 'rgba(255,255,255,0.9)');
        ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    }

    resize();
    window.addEventListener('resize', resize);
    onScroll();
    requestAnimationFrame(frame);
}

/* ==========================================================================
   8. Glass Lens Cursor Effect
   ========================================================================== */
function initGlassLens() {
    const lens = document.getElementById('glass-lens');
    if (!lens) return;

    // Only activate on devices with a fine pointer (mouse)
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    let mouseX = -200;
    let mouseY = -200;
    let lensX = -200;
    let lensY = -200;
    let isVisible = false;
    const ease = 0.12; // Lower = smoother/laggier trailing

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isVisible) {
            isVisible = true;
            lens.classList.add('active');
        }
    });

    // Hide when mouse leaves the viewport
    document.addEventListener('mouseleave', () => {
        isVisible = false;
        lens.classList.remove('active');
    });

    document.addEventListener('mouseenter', () => {
        isVisible = true;
        lens.classList.add('active');
    });

    // Grow lens when hovering over interactive elements
    const interactiveSelectors = 'a, button, input, textarea, select';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            lens.classList.add('hovering');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            lens.classList.remove('hovering');
        }
    });

    // Animation loop — smooth easing toward mouse position at 60fps
    function animate() {
        lensX += (mouseX - lensX) * ease;
        lensY += (mouseY - lensY) * ease;

        lens.style.left = lensX + 'px';
        lens.style.top = lensY + 'px';

        requestAnimationFrame(animate);
    }

    animate();
}
