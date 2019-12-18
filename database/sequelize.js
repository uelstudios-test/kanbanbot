const Sequelize = require("sequelize");

// Init database instance
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        define: {
            timestamps: true // Add createdAt and updatedAt
        },
        pool: {
            max: process.env.DB_POOL_MAX || 4,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: false
    }
);

// Test the connection
sequelize
    .authenticate()
    .then(() => {
        console.log(`Connection to the database as ${process.env.DB_USER}@${process.env.DB_HOST} has been established successfully.`);
    })
    .catch(err => {
        // Failing here is not a bad thing. The database may needs a little bit longer to start up.
        console.error(`Unable to connect to the database as ${process.env.DB_USER}@${process.env.DB_HOST}:`, err);
        process.exit(0);
    });

module.exports = sequelize;