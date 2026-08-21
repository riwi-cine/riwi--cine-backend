module.exports = {
  up: async (queryInterface, Sequelize) => {
    // We'll do this without transaction for simplicity in baseline
    // (you can add transaction later if needed for complex cases)

    // === COPY-PASTE SECTION FROM schema.sql BELOW ===
    // For each CREATE TABLE in your schema.sql, convert it to:

    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      countryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'country_id'
        // IMPORTANT: NO defaultValue here (as you requested)
      },
      cityId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'city_id'
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      passwordHash: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: 'password_hash'
      },
      firstName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: 'first_name'
      },
      lastName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: 'last_name'
      },
      phone: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      birthDate: {
        type: Sequelize.DATEONLY,  // IMPORTANT: Use DATEONLY, not DATE
        allowNull: false,
        field: 'birth_date'
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'email_verified'
      },
      marketingOptIn: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'marketing_opt_in'
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: 'ACTIVE'
      },
      failedAttempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'failed_attempts'
      },
      lockedUntil: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'locked_until'
      },
      role: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: 'user'
      }
    }, {
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
      paranoid: true
    });

    // === REPEAT FOR OTHER TABLES ===
    // You can start with just a few critical tables and add more later

    // Example for countries (simpler table):
    await queryInterface.createTable('countries', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      code: {
        type: Sequelize.STRING(3),
        allowNull: false,
        unique: true
      }
    });

    // Add more tables as you have time or as you work on them
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order (be careful with FKs)
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('countries');
    // Add more dropTable calls as you add createTable calls
  }
};