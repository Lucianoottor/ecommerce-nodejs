// models/cartItem.js
module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    cartItemId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Carts', // refere-se à tabela Cart
        key: 'cartId'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products', // refere-se à tabela Product
        key: 'productId'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  });

  CartItem.associate = (models) => {
    // Associação com o Carrinho (um item pertence a um carrinho)
    CartItem.belongsTo(models.Cart, { foreignKey: 'cartId', as: 'cart' });
    
    // Associação com o Produto (um item refere-se a um produto)
    CartItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  };

  return CartItem;
};
