"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        name: "Dina Fadiah",
        age: 30,
        address: "Padang",
        role: "Superadmin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tika",
        age: 26,
        address: "Padang",
        role: "Superadmin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dewi",
        age: 26,
        address: "Bogor",
        role: "Superadmin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Budi",
        age: 26,
        address: "Jambi",
        role: "Superadmin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "syifa",
        age: 26,
        address: "Samarinda",
        role: "Superadmin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const insertUsers = await queryInterface.bulkInsert("Users", users, {
      returning: true,
    });

    const passwords = [
      "$2a$12$TuwXLQu7z9HLmVoDvPm4Je5NiBhbhVWU3kWuclbETZHs4lhYhJqBK",
      "$2a$12$KdKFXLQ.LzFvg4aEl3EaPuJmPvsg4TkaAAEKjH9GEThmHAdPfVW5K",
      "$2a$12$lsGKTebzeyCAiaGpO5N.We63D2PkBynihzT/.t1fH69mBur1LMbs2",
      "$2a$12$ns9MTYrckVfaYucRAYhU.eWUNeVQIeo2A0E08nhc/GtqMG45Yp9VW",
      "$2a$12$9z/qNNZ8Y74uNGKAFiPS.Od3gAJ23mb2sefx622xvJK40txO8oNqG",
    ];

    const auths = insertUsers.map((user, index) => ({
      email: `${user.name}@gmail.com`,
      password: passwords[index],
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Auths", auths);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Auths", null, {});
  },
};
