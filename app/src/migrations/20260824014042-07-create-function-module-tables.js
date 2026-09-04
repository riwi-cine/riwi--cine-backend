"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("function_types", {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
            name: { type: Sequelize.STRING(100), allowNull: false },
            projection: { type: Sequelize.STRING(50), allowNull: false },
            language: { type: Sequelize.STRING(50), allowNull: false },
            created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
            updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
            deleted_at: { type: Sequelize.DATE, allowNull: true },
        });

        await queryInterface.createTable("room_types", {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
            name: { type: Sequelize.STRING(50), allowNull: false, unique: true },
            description: { type: Sequelize.STRING(255), allowNull: false },
        });

        await queryInterface.createTable("movies", {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
            title: { type: Sequelize.STRING(255), allowNull: false },
            synopsis: { type: Sequelize.TEXT, allowNull: false },
            classification: { type: Sequelize.STRING(20), allowNull: false },
            duration_min: { type: Sequelize.INTEGER, allowNull: false },
            director: { type: Sequelize.STRING(150), allowNull: false },
            poster_url: { type: Sequelize.STRING(500), allowNull: false },
            trailer_url: { type: Sequelize.STRING(500), allowNull: false },
            status: { type: Sequelize.STRING(30), allowNull: false },
            rating: { type: Sequelize.DECIMAL(3, 2), allowNull: false, defaultValue: 0 },
        });

        await queryInterface.createTable("movie_releases", {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
            movie_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "movies", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            country_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "countries", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },
            release_date: { type: Sequelize.DATE, allowNull: false },
        });

        await queryInterface.createTable("rooms", {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
            cinema_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "cinemas", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },
            room_type_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "room_types", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },
            name: { type: Sequelize.STRING(50), allowNull: false },
            capacity: { type: Sequelize.INTEGER, allowNull: false },
            extra_price: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
        });

        await queryInterface.createTable("seats", {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
            room_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "rooms", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            row_label: { type: Sequelize.STRING(10), allowNull: false },
            seat_number: { type: Sequelize.INTEGER, allowNull: false },
            status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "AVAILABLE" },
        });

        await queryInterface.createTable("functions", {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
            movie_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "movies", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },
            movie_release_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: { model: "movie_releases", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            room_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "rooms", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },
            function_type_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "function_types", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },
            starts_at: { type: Sequelize.DATE, allowNull: false },
            base_price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
            active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
        });

        await queryInterface.createTable("tickets", {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
            order_id: { type: Sequelize.INTEGER, allowNull: false },
            function_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "functions", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            seat_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "seats", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },
            holder_user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },
            qr_code: { type: Sequelize.STRING(255), allowNull: false, unique: true },
            price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
            status: { type: Sequelize.STRING(30), allowNull: false },
            scanned_by_user_id: { type: Sequelize.INTEGER, allowNull: true },
            scanned_at: { type: Sequelize.DATE, allowNull: true },
        });

        await queryInterface.createTable("seat_locks", {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
            cart_id: { type: Sequelize.INTEGER, allowNull: false },
            function_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "functions", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            seat_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "seats", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            expires_at: { type: Sequelize.DATE, allowNull: false },
        });

        await queryInterface.addConstraint("seat_locks", {
            fields: ["function_id", "seat_id"],
            type: "unique",
            name: "seat_locks_function_id_seat_id_unique",
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("seat_locks");
        await queryInterface.dropTable("tickets");
        await queryInterface.dropTable("functions");
        await queryInterface.dropTable("seats");
        await queryInterface.dropTable("rooms");
        await queryInterface.dropTable("movie_releases");
        await queryInterface.dropTable("movies");
        await queryInterface.dropTable("room_types");
        await queryInterface.dropTable("function_types");
    },
};
