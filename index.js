import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "omar2776",
  port: 5432,
});
db.connect();

// app.use(bodyParser.urlencoded({ extended: true })); use when you use forms dumbass
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", async (req, res) => {
    console.log("GET")
    const result = await db.query("SELECT * FROM tasks");

    let tasks = [];
    result.rows.forEach((task) => {
        tasks.push({
            id: task.task_id,
            text: task.task
        });
    });

    console.log(tasks);

    res.render("index.ejs", {
        tasks: tasks
    });
});

app.post("/", async (req, res) => {
    console.log("POST")
    const task = req.body.text;
    const result = await db.query("INSERT INTO tasks (task) VALUES ($1)", [task]);

    res.redirect("/");
});

app.patch("/", async (req, res) => {
    console.log("PATCH")
    const id = req.body.id;
    const task = req.body.text;
    const result = await db.query("UPDATE tasks SET task = $1 WHERE task_id = $2", [task, id]);

    res.redirect("/");
});

app.delete("/", async (req, res) => {
    console.log("DELETE")
    const id = req.body.id;
    const result = await db.query("DELETE FROM tasks WHERE task_id = $1", [id]);

    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
});
