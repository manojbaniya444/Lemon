import lemon from "@src/lemon"

const app = lemon()

const PORT = 9000;
const hostname = "localhost";

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Hello from the server"
    })
})

app.get("/greeting", (req, res) => {
    return res.json({
        greeting: "Hello nice to see you"
    })
})

app.listen(PORT, hostname, () => {
  console.log(`server is running on localhost:${PORT}`);
});