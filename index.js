let boxes = document.querySelectorAll(".box")
let indic = document.querySelector(".indic")
let src = null
let dest = null
let btn
let btnClicked = false
let N = boxes.length // #rows = #cols
let sqrtN = Math.sqrt(N)
let grid = document.querySelector(".grid-container")
grid.style.setProperty("grid-template-columns", `repeat(${sqrtN}, 1fr)`)
let matrix1D = []
for (let i = 0; i < N; i++) matrix1D[i] = 0
let PATH = []

boxes.forEach((box, i) => {
    box.classList.add(i)
    box.addEventListener("mousedown", (e) => {
        if (src == null) {
            src = parseInt(box.classList[1])
            matrix1D[src] = 1
            box.classList.add("src")
            indic.textContent = "Arrivée ?"
        } else if (dest == null) {
            dest = parseInt(box.classList[1])
            matrix1D[dest] = 1
            box.classList.add("dest")
            indic.innerHTML = "Ajouter barriers <button>Stop</button>"
            btn = document.querySelector("button")
        } else {
            let isDrawing = false
            grid.addEventListener("mousedown", (e) => isDrawing = true)
            document.addEventListener("mouseup", (e) => isDrawing = false)
            grid.addEventListener("mousemove", (e) => {
                let target = e.target.classList[1]
                if (target == src || target == dest) return
                if (isDrawing && !btnClicked) {
                    e.target.classList.add("barrier")
                    matrix1D[e.target.classList[1]] = 2
                }
            })
            btn.addEventListener("click", () => {
                btnClicked = true
                PATH = BFS(src, dest)
            })
        }
    })
})

function neighbors(num) {
    let inum = Math.floor(num / sqrtN)
    let jnum = num % sqrtN
    let arr = []
    for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
            if (i == j) continue
            if (i == -1 && j == 1) continue
            if (i == 1 && j == -1) continue
            let vi = inum + i
            let vj = jnum + j
            if (vi < 0 || vi >= sqrtN || vj < 0 || vj >= sqrtN) continue
            arr.push(vi * sqrtN + vj)
        }
    }
    return arr
}

function BFS(src, dest) {
    /* Initialisation */
    let prev = []
    let D = []
    let visited = []
    for (let i = 0; i < N; i++) {
        D[i] = Infinity
        prev[i] = null
        visited[i] = false
    }
    D[src] = 0
    prev[src] = -1
    visited[src] = true

    /* Implémentation */
    let queue = [src]
    while (queue.length != 0) {
        let u = queue.shift()
        for (let v of neighbors(u)) {
            if (!visited[v]) {
                visited[v] = true
                if (matrix1D[v] != 2) {
                    prev[v] = u
                    D[v] = D[u] + 1
                    queue.push(v)
                }
            }
            if (v == dest) {
                for (let i = dest; i != -1; i = prev[i]) {
                    PATH.unshift(i)
                }
                boxes.forEach(box => {
                    if (PATH.includes(parseInt(box.classList[1]))) {
                        box.classList.add("path")
                    }
                })
                indic.textContent = "Chemin trouvé"
                return PATH
            }
        }
    }
    indic.textContent = "Aucun chemin"
    return null
}
