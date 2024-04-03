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

app.get("/owners", (req, res) => {
  const limit = req.query.limit ?? 2;
  const ownerID = req.query.statusTodo;
  let filterOwners = owners;
  if (ownerID) {
    // Your Endpoint URL: http://localhost:1463/todos/?statusTodo=todo
    http: filterOwners = filterOwners.filter(
      (owner) => owner.ownerID === ownerID
    );
  }
  if (filterOwners) {
    //Your Endpoint URL: http://localhost:1463/todos/?limit=10
    http: filterOwners = filterOwners.slice(0, limit);
  }
  if (filterOwners.length > 0) {
    res.status(200).json(filterOwners);
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

//Your Endpoint URL: http://localhost:1463/todos/owner/a2
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

//Your Endpoint URL : http://localhost:1463/changeStatus/1/status
app.put("/changeStatus/:id/status", (req, res) => {
  const { id } = req.params;
  let updated = false;

  todos = todos.map((todo) => {
    if (todo.id === id) {
      updated = true;

      return {
        ...todo,
        statusTodo: req.body.statusTodo ? req.body.statusTodo : todo.statusTodo,
      };
    } else {
      return todo;
    }
  });

  if (updated) {
    res.status(200).send({
      message: `${
        req.body.statusTodo
          ? "todo status is updated"
          : "todo status is the same"
      }`,
      id,
    });
  } else {
    res.status(404).send({ message: "there is no todo with that id", id });
  }
});

//Your Endpoint URL :http://localhost:1463/todos/changeOwner/a2/newOwnerId
//owner-in id-sini deyisirik
app.put("/todos/changeOwner/:id/newOwnerId", (req, res) => {
  const { id } = req.params;
  let update = false;
  owners = owners.map((item) => {
    if (item.id === id) {
      update = true;
      return { ...item, id: req.body.id ? req.body.id : item.id };
    } else {
      return item;
    }
  });

  todos = todos.map((todo) => {
    if (todo.ownerId === id) {
      update = true;
      return { ...todo, ownerId: req.body.id };
    } else {
      return todo;
    }
  });

  if (update) {
    res.status(200).send({
      message: `${
        req.body.id ? "owner id is updated" : "owner id is the same"
      }`,
      id,
    });
  } else {
    res.status(404).send({ message: "there is no owner with that id", id });
  }
});

//Your Endpoint URL : http://localhost:1463/todos/1
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  todos = todos.filter((del) => del.id !== id);
  res.status(200).json({ message: `todo is deleted:`, id });
});

//Your Endpoint URL : http://localhost:1463/todos/status/todo
app.delete("/todos/status/:statusTodo", (req, res) => {
  const { statusTodo } = req.params;
  const todosDelet = todos.filter((todo) => todo.statusTodo === statusTodo);
  if (todosDelet.length > 0) {
    todos = todos.filter((todo) => todo.statusTodo !== statusTodo);
    res
      .status(200)
      .json({ message: `Todos with status ${statusTodo} are deleted` });
  } else {
    res
      .status(404)
      .json({ message: `Todos of status ${statusTodo} are not found` });
  }
});

//Your Endpoint URL : http://localhost:1463/todos/delete/a1
app.delete("/todos/delete/:ownerId", (req, res) => {
  const { ownerId } = req.params;
  const ownerFoundByTodoId = owners.find((owner) => owner.id === ownerId);

  if (ownerFoundByTodoId) {
    console.log("ow", req.params);
    const deletedTodos = todos.filter((todo) => todo.ownerId === ownerId);
    todos = todos.filter((todo) => todo.ownerId !== ownerId);

    ownerFoundByTodoId.todosId = "no todos";

    deletedTodos.length > 0
      ? res.status(200).json({
          message: `All todos by owner with id ${ownerId} are deleted`,
          deletedTodos: deletedTodos,
        })
      : res.status(200).json({
          message: `There are no todos`,
        });
  } else {
    res.status(404).json({ message: `There are no owners with id ${ownerId}` });
  }
});

app.listen(portTodo, () => {
  console.log("Server is running");
});
