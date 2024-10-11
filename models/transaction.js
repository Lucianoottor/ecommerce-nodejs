module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
      transactionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      valorTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      metodoPagamento: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pendente'
      }
    });
    
    return Transaction;
  };
  