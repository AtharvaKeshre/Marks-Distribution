require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sql = require("mssql");

const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors({
  origin: true, // Reflect the request origin
  credentials: true, // Allow cookies and authorization headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use(bodyParser.json());

// SQL Server Configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Use encryption for Azure SQL
    trustServerCertificate: true, // For self-signed certificates
  },
};

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);
app.get("/api/status", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.get("/check", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.post("/api/user-details", async (req, res) => {
  console.log("Request received at /api/user-details");
  console.log("Request Body:", req.body);

  const { name, email, nuid, group } = req.body;

  if (!name || !email || !nuid || !group) {
    console.log("Validation failed: Missing fields");
    return res.status(400).json({ error: "All fields are required." });
  }
  

  try {
    const pool = await sql.connect(dbConfig);

    await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("email", sql.VarChar, email)
      .input("nuid", sql.VarChar, nuid)
      .input("group", sql.Int, group)
      .query(
        "INSERT INTO UserDetails (name, email, nuid, groupNumber) VALUES (@name, @email, @nuid, @group)"
      );

    console.log("User details saved successfully");
    res.status(201).json({ message: "User details saved successfully." });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to save user details." });
  }
});


// Endpoint to save group ratings
app.post("/api/group-ratings", async (req, res) => {
    console.log("Request received at /api/group-ratings");
    console.log("Request Body:", req.body);
  
    const { groupId, ratings } = req.body;
  
    if (!groupId || !ratings || !Array.isArray(ratings)) {
      console.log("Validation failed: Invalid data format");
      return res.status(400).json({ error: "Invalid data format." });
    }
  
    try {
      const pool = await sql.connect(dbConfig);
      console.log("Connected to the database");
  
      for (const rating of ratings) {
        const { name, points } = rating;
        console.log(`Inserting rating: ${name}, ${points}`);
        await pool
          .request()
          .input("groupId", sql.Int, groupId)
          .input("name", sql.VarChar, name)
          .input("points", sql.Int, points)
          .query(
            "INSERT INTO GroupRatings (groupId, memberName, points) VALUES (@groupId, @name, @points)"
          );
      }
  
      console.log("Group ratings saved successfully");
      res.status(201).json({ message: "Group ratings saved successfully." });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Failed to save group ratings." });
    }
  });


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);


});