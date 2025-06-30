const db = require('../config/db'); // sua conexão com o banco

const Customer = {
  getAll: (callback) => {
    const sql = 'SELECT * FROM customers ORDER BY registrationDate DESC';
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = 'SELECT * FROM customers WHERE id = ?';
    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql = `INSERT INTO customers 
      (name, email, phone, address, city, state, registrationDate) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())`;
    const params = [
      data.name,
      data.email,
      data.phone,
      data.address,
      data.city,
      data.state,
    ];
    db.query(sql, params, callback);
  },

  update: (id, data, callback) => {
    const sql = `UPDATE customers SET 
      name = ?, email = ?, phone = ?, address = ?, city = ?, state = ? 
      WHERE id = ?`;
    const params = [
      data.name,
      data.email,
      data.phone,
      data.address,
      data.city,
      data.state,
      id,
    ];
    db.query(sql, params, callback);
  },

  delete: (id, callback) => {
    const sql = 'DELETE FROM customers WHERE id = ?';
    db.query(sql, [id], callback);
  },
};

module.exports = Customer;
