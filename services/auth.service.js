const db = require('./db.service');
const sql = require('mssql');

class AuthService {
    async registerUser(username, email, password) {
        const query = `
            IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = @email)
            BEGIN
                INSERT INTO Users (Username, Email, Password, RegistrationDate, RoleID)
                OUTPUT INSERTED.UserID
                VALUES (@username, @email, @password, GETDATE(), 
                (SELECT RoleID FROM Roles WHERE RoleName = 'User'))
            END
            ELSE
            BEGIN
                -- Если пользователь уже существует, возвращаем его ID
                SELECT UserID FROM Users WHERE Email = @email
            END
        `;

        const params = [
            { name: 'username', type: sql.NVarChar, value: username },
            { name: 'email', type: sql.NVarChar, value: email },
            { name: 'password', type: sql.NVarChar, value: password }
        ];

        const result = await db.executeQuery(query, params);
        return result.recordset[0].UserID;
    }

    async findUserByEmail(email) {
        const query = 'SELECT * FROM Users WHERE Email = @email';
        const params = [
            { name: 'email', type: sql.NVarChar, value: email }
        ];

        const result = await db.executeQuery(query, params);
        return result.recordset[0];
    }

    async linkTelegramToUser(userId, telegramId) {
        const query = 'UPDATE Users SET TelegramId = @telegramId WHERE UserID = @userId';
        const params = [
            { name: 'userId', type: sql.Int, value: userId },
            { name: 'telegramId', type: sql.Int, value: telegramId }
        ];

        await db.executeQuery(query, params);
    }
}

module.exports = new AuthService();