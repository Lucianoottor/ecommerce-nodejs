const { Sequelize } = require(".");

// models/product.js
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
      productId:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      estoque: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
    Product.associate = (models) => {
      // Um produto pode estar em vários itens de carrinhos diferentes
      Product.hasMany(models.CartItem, { foreignKey: 'productId', as: 'cartItems' });
    };
  
    return Product;
  };
  