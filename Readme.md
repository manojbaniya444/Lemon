## Lemon
Lemon is a backend web framework to create http backend server like **Express JS** framework.

##  Creating a server

```javascript
const lemon = require("lemon")

const app = lemon;

app.get("/", (req, res) => {
    res.status(200).json({
        message: "server is running"
    })
})

app.listen(8080, () => {
    console.log('server is running on port:8080')
})
```