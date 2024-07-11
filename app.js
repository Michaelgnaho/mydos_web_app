import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import dotenv from "dotenv"; // Import dotenv to manage environment variables

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000; // Use PORT from environment variables or default to 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Set up session middleware
app.use(
  session({
    secret: "your-secret-key", // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
  })
);

// PostgreSQL client setup
const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect(); // Connect to PostgreSQL database

// Home route
app.get("/", (req, res) => {
  res.render("home.ejs");
});
// Login route
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
// Register route
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// Register new user
app.post("/register", async (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with 10 rounds of salt
    const insertQuery =
      "INSERT INTO clients (firstName, lastName, username, password) VALUES ($1, $2, $3, $4)";
    await db.query(insertQuery, [
      firstName,
      lastName,
      username,
      hashedPassword,
    ]);
    res.render("login");
  } catch (err) {
    if (err.code === "23505") {
      console.error("Username already exists");
      res.status(400).send("Username already exists");
    } else {
      console.error("Error registering user:", err);
      res.sendStatus(500); // Server error response
    }
  }
});

// Login user
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const findUserQuery = "SELECT * FROM clients WHERE username = $1";
    const result = await db.query(findUserQuery, [username]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        req.session.userId = user.id; // Set user ID in session
        req.session.save(); // Save the session
        res.redirect("/mydos"); // Redirect to the to-do list page
      } else {
        console.error("Authentication failed");
        res.redirect("/login");
      }
    } else {
      console.error("User not found");
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.sendStatus(500); // Server error response
  }
});

// Display user's to-do list
app.get("/mydos", async (req, res) => {
  const clientId = req.session.userId; // Get the user ID from the session
  if (!clientId) {
    return res.redirect("/login"); // Redirect to login if not authenticated
  }

  try {
    const listItemsQuery = "SELECT * FROM list_items WHERE client_id = $1";
    const result = await db.query(listItemsQuery, [clientId]);

    res.render("mydos", {
      listTitle: "My To-Do List",
      listItems: result.rows, // Pass the fetched list items to the template
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.sendStatus(500); // Server error response
  }
});

// Add new item to to-do list
app.post("/add", async (req, res) => {
  const { newItem, list } = req.body;
  const clientId = req.session.userId; // Ensure this is client_id

  if (!clientId) {
    console.error("No user ID found in session.");
    return res.status(400).send("User not logged in.");
  }

  try {
    const insertQuery =
      "INSERT INTO list_items (title, client_id) VALUES ($1, $2)";
    await db.query(insertQuery, [newItem, clientId]);
    res.redirect("/mydos"); // Redirect to the to-do list page
  } catch (error) {
    console.error("Error adding task:", error);
    res.sendStatus(500); // Server error response
  }
});

// Edit existing to-do item
app.post("/edit", async (req, res) => {
  const { updatedItemTitle, updatedItemId } = req.body;

  try {
    await db.query("UPDATE list_items SET title = $1 WHERE id = $2", [
      updatedItemTitle,
      updatedItemId,
    ]);
    res.redirect("/mydos"); // Redirect to the to-do list page
  } catch (err) {
    console.log("Error editing task:", err);
    res.sendStatus(500); // Server error response
  }
});

// Delete to-do item
app.post("/delete", async (req, res) => {
  const { deleteItemId } = req.body;

  try {
    await db.query("DELETE FROM list_items WHERE id = $1", [deleteItemId]);
    res.redirect("/mydos"); // Redirect to the to-do list page
  } catch (err) {
    console.log("Error deleting task:", err);
    res.sendStatus(500); // Server error response
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
