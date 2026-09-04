"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("actors", {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
            first_name: { type: Sequelize.STRING(100), allowNull: false },
            last_name: { type: Sequelize.STRING(100), allowNull: true },
            stage_name: { type: Sequelize.STRING(150), allowNull: true },
            biography: { type: Sequelize.TEXT, allowNull: true },
            photo_url: { type: Sequelize.STRING(500), allowNull: true },
            active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
        });

        await queryInterface.createTable("genres", {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
            name: { type: Sequelize.STRING(50), allowNull: false, unique: true },
        });

        await queryInterface.createTable("movie_actors", {
            movie_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                references: { model: "movies", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            actor_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                references: { model: "actors", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            character_name: { type: Sequelize.STRING(150), allowNull: true },
            display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
        });

        await queryInterface.createTable("movie_genres", {
            movie_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                references: { model: "movies", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            genre_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                references: { model: "genres", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
        });

        await queryInterface.createTable("movie_banners", {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
            movie_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "movies", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            image_url: { type: Sequelize.STRING(500), allowNull: false },
            alt_text: { type: Sequelize.STRING(255), allowNull: true },
            display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
            active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
            created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("movie_banners");
        await queryInterface.dropTable("movie_genres");
        await queryInterface.dropTable("movie_actors");
        await queryInterface.dropTable("genres");
        await queryInterface.dropTable("actors");
    },
};
