module.exports = {
    secret:
      process.env.JWT_SECRET ||
      "ee9cecd833add0edc1ff6eca6acf81905d792857f441210ac0ff16ada000cfc9",
    expiresIn: "8h",
  };
  