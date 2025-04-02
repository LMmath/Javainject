class JSExecutor {
    constructor() {
        this.scripts = {
            hello: '// Hello World Example\nconsole.log("Hello, World!");\nconsole.log("Welcome to JS Executor!");',
            loop: '// Loop Example\nfor(let i = 0; i < 5; i++) {\n    console.log(`Loop iteration ${i}`);\n}',
            dom: '// DOM Manipulation\ndocument.body.style.backgroundColor = "#000";\nsetTimeout(() => {\n    document.body.style.backgroundColor = "#0a0a0a";\n}, 1000);'
        };
        
        this.createStyles();
        this.createUI();
        this.initializeEventListeners();
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    }

    createStyles() {
        const styles = `
            body {
                margin: 0;
                padding: 0;
                background: #0a0a0a;
                color: #00ff88;
                font-family: 'Segoe UI', sans-serif;
                height: 100vh;
                overflow: hidden;
            }
            .container {
                display: flex;
                flex-direction: column;
                height: 100vh;
                padding: 10px;
                box-sizing: border-box;
            }
            .info-bar {
                background: #1a1a1a;
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                font-family: monospace;
            }
            .editor-container {
                display: flex;
                gap: 10px;
                flex: 1;
                margin-bottom: 10px;
            }
            .panel {
                flex: 1;
                background: #1a1a1a;
                border-radius: 5px;
                padding: 10px;
            }
            .title-bar {
                padding: 5px;
                background: #2a2a2a;
                border-radius: 3px;
                margin-bottom: 10px;
                color: #00ff88;
                font-size: 0.9em;
            }
            #editor, #output {
                width: 100%;
                height: calc(100% - 40px);
                background: #0d0d0d;
                color: #00ff88;
                border: 1px solid #333;
                border-radius: 3px;
                padding: 10px;
                font-family: Consolas, monospace;
                resize: none;
                outline: none;
            }
            #output {
                overflow-y: auto;
                white-space: pre-wrap;
            }
            .controls {
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
            }
            .btn {
                background: linear-gradient(45deg, #00cc69, #00ff88);
                color: #000;
                border: none;
                padding: 8px 15px;
                border-radius: 3px;
                cursor: pointer;
                font-weight: bold;
                transition: transform 0.2s;
            }
            .btn:hover {
                transform: scale(1.05);
            }
            .btn.clear {
                background: linear-gradient(45deg, #ff3366, #ff5588);
            }
            #scriptSelect {
                background: #0d0d0d;
                color: #00ff88;
                border: 1px solid #333;
                padding: 8px;
                border-radius: 3px;
                outline: none;
            }
            .status {
                color: #00ff88;
                font-size: 0.8em;
                padding: 5px;
                text-align: center;
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    createUI() {
        this.container = document.createElement('div');
        this.container.className = 'container';
        document.body.appendChild(this.container);

        // Info bar
        const infoBar = document.createElement('div');
        infoBar.className = 'info-bar';
        this.datetimeElement = document.createElement('span');
        const userElement = document.createElement('span');
        userElement.textContent = 'User: RipAngelhacks';
        infoBar.appendChild(this.datetimeElement);
        infoBar.appendChild(userElement);
        this.container.appendChild(infoBar);

        // Controls
        const controls = document.createElement('div');
        controls.className = 'controls';
        
        // Script select
        this.scriptSelect = document.createElement('select');
        this.scriptSelect.id = 'scriptSelect';
        this.scriptSelect.innerHTML = `
            <option value="">-- Select Example --</option>
            <option value="hello">Hello World</option>
            <option value="loop">Loop Example</option>
            <option value="dom">DOM Manipulation</option>
        `;
        
        // Buttons
        const runButton = document.createElement('button');
        runButton.className = 'btn';
        runButton.textContent = 'Run (F9)';
        
        const clearButton = document.createElement('button');
        clearButton.className = 'btn clear';
        clearButton.textContent = 'Clear';

        controls.append(this.scriptSelect, runButton, clearButton);
        this.container.appendChild(controls);

        // Editor container
        const editorContainer = document.createElement('div');
        editorContainer.className = 'editor-container';

        // Editor panel
        const editorPanel = document.createElement('div');
        editorPanel.className = 'panel';
        const editorTitle = document.createElement('div');
        editorTitle.className = 'title-bar';
        editorTitle.textContent = 'Editor';
        this.editor = document.createElement('textarea');
        this.editor.id = 'editor';
        this.editor.spellcheck = false;
        this.editor.value = '// Write your code here\nconsole.log("Hello, World!");';
        editorPanel.append(editorTitle, this.editor);

        // Output panel
        const outputPanel = document.createElement('div');
        outputPanel.className = 'panel';
        const outputTitle = document.createElement('div');
        outputTitle.className = 'title-bar';
        outputTitle.textContent = 'Output';
        this.output = document.createElement('div');
        this.output.id = 'output';
        outputPanel.append(outputTitle, this.output);

        editorContainer.append(editorPanel, outputPanel);
        this.container.appendChild(editorContainer);

        // Status
        this.status = document.createElement('div');
        this.status.className = 'status';
        this.container.appendChild(this.status);
    }

    initializeEventListeners() {
        this.scriptSelect.addEventListener('change', () => this.loadScript());
        this.container.querySelector('.btn').addEventListener('click', () => this.executeCode());
        this.container.querySelector('.btn.clear').addEventListener('click', () => this.clearOutput());
        
        // Add F9 shortcut for running code
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F9') {
                e.preventDefault();
                this.executeCode();
            }
        });

        // Add Ctrl+S prevention
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
            }
        });
    }

    updateDateTime() {
        const now = new Date();
        const formatted = now.toISOString().slice(0, 19).replace('T', ' ');
        this.datetimeElement.textContent = `Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): ${formatted}`;
    }

    loadScript() {
        if (this.scriptSelect.value) {
            this.editor.value = this.scripts[this.scriptSelect.value];
            this.updateStatus('Example loaded!');
        }
    }

    executeCode() {
        this.output.innerHTML = '';
        
        const originalConsole = console.log;
        console.log = (...args) => {
            originalConsole.apply(console, args);
            this.output.innerHTML += args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') + '<br>';
        };

        try {
            const code = this.editor.value;
            const result = eval(`(async () => { ${code} })()`);
            if (result instanceof Promise) {
                result.catch(error => {
                    this.output.innerHTML += `<span style="color: #ff3366">Error: ${error.message}</span><br>`;
                    this.updateStatus('Execution failed!', 'error');
                });
            }
            this.updateStatus('Code executed successfully!');
        } catch (error) {
            this.output.innerHTML += `<span style="color: #ff3366">Error: ${error.message}</span><br>`;
            this.updateStatus('Execution failed!', 'error');
        }

        console.log = originalConsole;
    }

    clearOutput() {
        this.output.innerHTML = '';
        this.updateStatus('Output cleared');
    }

    updateStatus(message, type = 'success') {
        this.status.style.color = type === 'error' ? '#ff3366' : '#00ff88';
        this.status.textContent = message;
        setTimeout(() => this.status.textContent = '', 3000);
    }
}

// Initialize the executor
new JSExecutor();
