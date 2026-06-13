const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const parallaxDir = path.resolve(__dirname, '..')
const docsDir = path.resolve(parallaxDir, '..', 'docs')
const assetFiles = ['gate.css', 'monthsary.css', 'Pahintulot.mp3']

function emptyDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
  fs.mkdirSync(dir, { recursive: true })
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    return
  }
  fs.mkdirSync(dest, { recursive: true })
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name)
    const to = path.join(dest, name)
    if (fs.statSync(from).isDirectory()) {
      copyDir(from, to)
    } else {
      copyFile(from, to)
    }
  }
}

console.log('Building parallax...')
execSync('npm run build', { cwd: parallaxDir, stdio: 'inherit' })

console.log('Assembling docs/ for GitHub Pages...')
emptyDir(docsDir)

const pagesDir = path.join(parallaxDir, 'examples', 'pages')
for (const name of fs.readdirSync(pagesDir)) {
  if (name.endsWith('.html')) {
    copyFile(path.join(pagesDir, name), path.join(docsDir, name))
  }
}

const assetsDir = path.join(parallaxDir, 'examples', 'assets')
for (const name of assetFiles) {
  const src = path.join(assetsDir, name)
  if (!fs.existsSync(src)) {
    console.warn('Warning: missing ' + name)
    continue
  }
  copyFile(src, path.join(docsDir, name))
}

copyDir(path.join(assetsDir, 'images'), path.join(docsDir, 'images'))
copyFile(
  path.join(parallaxDir, 'dist', 'parallax.js'),
  path.join(docsDir, 'parallax.js')
)
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '')

console.log('Done. GitHub Pages folder: ' + docsDir)
