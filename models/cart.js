// models/cart.js
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    cartId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  });

  Cart.associate = (models) => {
    // Associação com o usuário (um carrinho pertence a um usuário)
    Cart.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    
    // Associação com CartItem (um carrinho pode ter muitos itens)
    Cart.hasMany(models.CartItem, { foreignKey: 'cartId', as: 'items' }); 
  };

  return Cart;
};
