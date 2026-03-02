export default {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true
    },
}