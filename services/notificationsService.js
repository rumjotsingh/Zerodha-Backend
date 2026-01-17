import Alert from "../model/AlertModel.js";
import Stock from "../model/StockModel.js";

export const checkAlerts = async (io) => {
  const alerts = await Alert.find({ triggered: false });
  for (const alert of alerts) {
    const stock = await Stock.findOne({ symbol: alert.symbol });
    if (!stock) continue;

    let triggered = false;
    if (alert.condition === "ABOVE" && stock.price >= alert.price) {
      triggered = true;
    } else if (alert.condition === "BELOW" && stock.price <= alert.price) {
      triggered = true;
    }

    if (triggered) {
      alert.triggered = true;
      await alert.save();

      // Notify user via WebSocket
      io.to(alert.userId.toString()).emit("alert:triggered", {
        symbol: alert.symbol,
        condition: alert.condition,
        price: alert.price,
        currentPrice: stock.price,
      });
    }
  }
};

export const createAlert = async (userId, symbol, condition, price) => {
  const alert = new Alert({ userId, symbol, condition, price });
  await alert.save();
  return alert;
};

export const getUserAlerts = async (userId) => {
  return await Alert.find({ userId });
};

export const deleteAlert = async (alertId, userId) => {
  return await Alert.findOneAndDelete({ _id: alertId, userId });
};
