async function requestDate() {
    const response = await fetch("./book.json")
    const data = await response.json()
    
    const div = document.getElementById("books-container")
    const ul = document.createElement("ul")
    ul.classList = "books-list"

    data.map((book) => {
        const li = document.createElement("li")
        const a = document.createElement("a")
        a.href = book.href
        a.innerText = book.title
        
        div.appendChild(ul)
        ul.appendChild(li)
        li.appendChild(a)
    })
}

requestDate()