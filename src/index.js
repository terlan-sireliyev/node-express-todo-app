import express from "express";
import portTodo from "../utils/portTodo.js";
import { readFile } from "fs/promises";
const app = express();
let todos = JSON.parse((await readFile(process.env.TODO_DATA)).toString());
let owners = JSON.parse((await readFile(process.env.OVNERS_DATA)).toString());
app.use(express.json());
app.get("/todos", (req, res) => {
  const limit = req.query.limit ?? 3;
  const statusTodo = req.query.statusTodo;
  let filterTodo = todos;
  if (statusTodo) {
    // Your Endpoint URL: http://localhost:1463/todos/?statusTodo=todo
    http: filterTodo = filterTodo.filter(
      (todo) => todo.statusTodo === statusTodo
    );
  }
  if (filterTodo) {
    //Your Endpoint URL: http://localhost:1463/todos/?limit=10
    http: filterTodo = filterTodo.slice(0, limit);
  }
  if (filterTodo.length > 0) {
    res.status(200).json(filterTodo);
  } else {
    res.status(404).json("error");
  }
});
app.get("/todos/:id", (req, res) => {
  const { id } = req.params;
  let todo;
  if (id) {
    todo = todos.find((item) => item.id === id);
    res.send(todo);
  }
});
//Your Endpoint URL: http://localhost:1463/todos/owner/a1
http: app.get("/todos/owner/:ownerId", (req, res) => {
  const ownerId = req.params.ownerId;
  const owner = owners.find((ow) => ow.id === ownerId);
  if (owner) {
    const todoOwner = todos.filter(
      (todoOwFilter) => todoOwFilter.ownerId === owner.id
    );
    if (todoOwner.length > 0) {
      res.status(200).json(todoOwner);
    } else {
      res.status(404).json("error");
    }
  } else {
    res.status(404).json({ message: `there is no owner with id= ${ownerId}` });
  }
});

//Your Endpoint URL:  http://localhost:1463/2/owner
app.get("/:id/owner", (req, res) => {
  const { id } = req.params;
  const todoIdOwner = todos.find((item) => item.id === id);
  if (todoIdOwner) {
    const ownerIdTodo = owners.filter(
      (item) => item.todosId === todoIdOwner.id
    );
    if (ownerIdTodo.length > 0) {
      res.status(200).json(ownerIdTodo);
    } else {
      res.status(404).json("error");
    }
  } else {
    res.status(404).json({ message: `there is no owner with id= ${ownerId}` });
  }
});
app.post("/todos", (req, res) => {
  const { statusTodo, ...data } = req.body;
  const flagTodo = statusTodo ? req.body : { ...data, statusTodo: "todo" };
  todos.push(flagTodo);
  res.status(201).json({ message: `new todo is created: ${req.body.title}` });
});

app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  let flagTodoPut = false;
  todos = todos.map((item) => {
    if (item.id === id) {
      flagTodoPut = true;
      return req.body;
    }
    return item;
  });
  if (flagTodoPut) {
    res.status(200).json({ message: `new todo is update:`, id });
  } else {
    res.status(404).send({ message: "there is no todo with that id", id });
  }
});
//Your Endpoint URL : http://localhost:1463/todos/changeStatus/1/done
app.put("/todos/changeStatus/:id/:statusTodo", (req, res) => {
  const { id } = req.params;
  const { statusTodo } = req.body;
  const todoToUpdate = todos.find((item) => item.id === id);
  if (todoToUpdate) {
    todoToUpdate.statusTodo = statusTodo;
    res.status(200).json({
      message: `Todo with ID ${id} has been updated with status '${statusTodo}'.`,
    });
  }
  res.status(404).json({ message: "No todo found with that id" });
});

//Your Endpoint URL : http://localhost:1463/todos/1
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  todos = todos.filter((del) => del.id !== id);
  res.status(200).json({ message: `todo is deleted:`, id });
});
//Your Endpoint URL : http://localhost:1463/todos/status/todo
app.delete("/todos/status/:statusTodo", (req, res) => {
  const { statusTodo } = req.body;
  todos = todos.filter((todo) => todo.statusTodo !== statusTodo);
  res
    .status(200)
    .json({ message: `Todos with status ${statusTodo} are deleted` });
});
//Your Endpoint URL : http://localhost:1463/todos/status/a2
app.delete("/todos/status/:owerId", (req, res) => {
  const { ownerId } = req.body;
  todos = todos.filter((todo) => todo.ownerId !== ownerId);
  res.status(200).json({ message: `Todos with status ${ownerId} are deleted` });
});

app.listen(portTodo, () => {
  console.log("Server is running");
});
