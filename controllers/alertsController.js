import {
  createAlert,
  getUserAlerts,
  deleteAlert,
} from "../services/notificationsService.js";

export const createUserAlert = async (req, res) => {
  try {
    const { symbol, condition, price } = req.body;
    const userId = req.user.userId;
    const alert = await createAlert(userId, symbol, condition, price);
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAlerts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const alerts = await getUserAlerts(userId);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const userId = req.user.userId;
    const alert = await deleteAlert(alertId, userId);
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }
    res.json({ message: "Alert deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
