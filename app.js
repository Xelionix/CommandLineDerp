// app.js

const term = new Terminal();
const fitAddon = new FitAddon.FitAddon();

term.loadAddon(fitAddon);
term.open(document.getElementById('terminal'));
fitAddon.fit();

term.writeln('Welcome to Web Batch Environment!');
term.writeln('Type "help" for a list of commands.');

const fileSystem = {
    '/': {
        type: 'directory',
        content: {
            'file1.txt': {
                type: 'file',
                content: 'Hello, this is file1!'
            },
            'file2.txt': {
                type: 'file',
                content: 'Welcome to your second file!'
            },
            'directory1': {
                type: 'directory',
                content: {}
            }
        }
    }
};

term.onKey((e) => {
    const printable = !e.altKey && !e.ctrlKey && !e.metaKey;
    if (e.key === 'Enter') {
        term.writeln('');
        processCommand(term);
    } else if (e.key === 'Backspace') {
        term.write('\b \b');
    } else if (printable) {
        term.write(e.key);
    }
});

function processCommand(term) {
    const command = term.buffer.active.getLine(0).translateX(term.cols).trim();
    term.writeln(`> ${command}`);

    const parts = command.split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    if (cmd === 'help') {
        term.writeln('Available commands:');
        term.writeln('- help: Display this help message');
        term.writeln('- echo [text]: Print the specified text');
        term.writeln('- ls: List files in the current directory');
        term.writeln('- cd [directory]: Change current directory');
        term.writeln('- cat [file]: Display the contents of a file');
        term.writeln('- mkdir [directory]: Create a new directory');
        term.writeln('- rmdir [directory]: Remove a directory');
        term.writeln('- copy [source] [destination]: Copy a file');
        term.writeln('- del [file]: Delete a file');
        term.writeln('- type [file]: Display the contents of a file');
    } else if (cmd.startsWith('echo ')) {
        const text = args.join(' ');
        term.writeln(text);
    } else if (cmd === 'ls') {
        const currentDir = getCurrentDirectory();
        const content = Object.keys(currentDir.content);
        term.writeln(content.join(' '));
    } else if (cmd.startsWith('cd ')) {
        const targetDir = args[0];
        changeDirectory(targetDir);
    } else if (cmd === 'cat') {
        const targetFile = args[0];
        displayFileContent(targetFile);
    } else if (cmd === 'mkdir') {
        const newDir = args[0];
        createDirectory(newDir);
    } else if (cmd === 'rmdir') {
        const targetDir = args[0];
        removeDirectory(targetDir);
    } else if (cmd === 'copy') {
        const source = args[0];
        const destination = args[1];
        copyFile(source, destination);
    } else if (cmd === 'del') {
        const targetFile = args[0];
        deleteFile(targetFile);
    } else {
        term.writeln('Unknown command. Type "help" for assistance.');
    }

    term.prompt();
}

function getCurrentDirectory() {
    return fileSystem['/'];
}

function changeDirectory(targetDir) {
    const currentDir = getCurrentDirectory();
    if (currentDir.content[targetDir] && currentDir.content[targetDir].type === 'directory') {
        term.writeln(`Changing to directory: ${targetDir}`);
    } else {
        term.writeln(`Error: Directory not found - ${targetDir}`);
    }
}

function displayFileContent(targetFile) {
    const currentDir = getCurrentDirectory();
    const file = currentDir.content[targetFile];

    if (file && file.type === 'file') {
        term.writeln(file.content);
    } else {
        term.writeln(`Error: File not found - ${targetFile}`);
    }
}

function createDirectory(newDir) {
    const currentDir = getCurrentDirectory();
    if (!currentDir.content[newDir]) {
        currentDir.content[newDir] = { type: 'directory', content: {} };
        term.writeln(`Directory created: ${newDir}`);
    } else {
        term.writeln(`Error: Directory already exists - ${newDir}`);
    }
}

function removeDirectory(targetDir) {
    const currentDir = getCurrentDirectory();
    if (currentDir.content[targetDir] && currentDir.content[targetDir].type === 'directory') {
        delete currentDir.content[targetDir];
        term.writeln(`Directory removed: ${targetDir}`);
    } else {
        term.writeln(`Error: Directory not found - ${targetDir}`);
    }
}

function copyFile(source, destination) {
    const currentDir = getCurrentDirectory();
    const sourceFile = currentDir.content[source];
    if (sourceFile && sourceFile.type === 'file') {
        currentDir.content[destination] = { type: 'file', content: sourceFile.content };
        term.writeln(`File copied: ${destination}`);
    } else {
        term.writeln(`Error: Source file not found - ${source}`);
    }
}

function deleteFile(targetFile) {
    const currentDir = getCurrentDirectory();
    if (currentDir.content[targetFile] && currentDir.content[targetFile].type === 'file') {
        delete currentDir.content[targetFile];
        term.writeln(`File deleted: ${targetFile}`);
    } else {
        term.writeln(`Error: File not found - ${targetFile}`);
    }
}

term.prompt = () => {
    term.write('\n$ ');
};

term.prompt();
</script>
</body>
</html>
