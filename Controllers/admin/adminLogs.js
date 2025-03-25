const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, "../../logs");


if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getLogFilePath = (category) => path.join(logsDir, `${category}_logs.json`);

const logChange = (category, action, id, oldValue, newData) => {
  console.log('Log function executed');
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${action} | ID: ${id} | OLD: ${oldValue} | NEW: ${newData}\n`;

  const logFilePath = getLogFilePath(category);
  fs.appendFileSync(logFilePath, logEntry, "utf8");
};

const getLogs = (category) => {
  const logFilePath = getLogFilePath(category);
  if (!fs.existsSync(logFilePath)) return [];

  const logEntries = fs.readFileSync(logFilePath, "utf8").trim().split("\n");

  return logEntries
    .map((entry) => {
      const logMatch = entry.match(/^\[(.*?)\] (.*?) \| ID: (.*?) \| OLD: (.*?) \| NEW: (.*)$/);
      if (!logMatch) return null;

      return {
        timestamp: logMatch[1],
        action: logMatch[2],
        id: logMatch[3],
        oldData: logMatch[4],
        newData: logMatch[5],
      };
    })
    .filter(Boolean);
};


const clearLogs = (category) => {
  const logFilePath = getLogFilePath(category);
  fs.writeFileSync(logFilePath, "", "utf8");
};

module.exports = { logChange, getLogs, clearLogs };
