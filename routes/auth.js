const express = require("express");
const route = express.Router();
const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Rota de login que cria o usuario padrão 
route.post("/login", async (req, res) => {
    const { username, password } = req.body;

    // Validar input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and pa ssword are required." });
    }

    //puxando informações de login do usuario
    try {
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const jwtSecret = process.env.JWT_SECRET;

        //Verifica os campos 
        if (!adminUsername || !adminPassword || !jwtSecret) {
            return res.status(500).json({ message: "Server configuration is incomplete." });
        }

        // Criar usuário admin se não existir
        const adminExists = await User.findOne({ where: { username: adminUsername } });
        if (!adminExists) {
            const hashedPassword = await bcryptjs.hash(adminPassword, 10);
            await User.create({
                username: adminUsername,
                password: hashedPassword,
                role: "ADMIN"
            });
            console.log("Admin user created successfully.");
        }

        // Login do usuário
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: "Usuario não existente!" });
        }

        //Verfica a senha criptografada do usuario
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "credencial inválida!" });
        }

        // Gerar token JWT
        const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: "1h" });
        return res.status(200).json({ message: "Login successful.", token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
});


// Exportação livre
module.exports = route;
