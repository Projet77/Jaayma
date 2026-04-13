const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'jaay-ma-app', 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(srcDir);
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace literal strings: 'http://localhost:5000/...' -> (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/...'
    content = content.replace(/'http:\/\/localhost:5000/g, "(process.env.REACT_APP_API_URL || 'http://localhost:5000') + '");
    
    // Replace double quote strings: "http://localhost:5000/..." -> (process.env.REACT_APP_API_URL || 'http://localhost:5000') + "/..."
    content = content.replace(/"http:\/\/localhost:5000/g, "(process.env.REACT_APP_API_URL || 'http://localhost:5000') + \"");

    // Replace template literals: `http://localhost:5000/...` -> `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/...`
    content = content.replace(/`http:\/\/localhost:5000/g, "`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}");

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
        console.log(`Updated: ${file}`);
    }
});

console.log(`Total files generated/updated: ${changedFiles}`);
