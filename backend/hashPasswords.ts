import bcrypt from "bcryptjs";

const passwords = [
  "admin123",
  "ahmed123",
  "sara123",
];

const generateHashes = async () => {
  for (const password of passwords) {
    const hash = await bcrypt.hash(password, 10);

    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
    console.log("-------------------------");
  }
};

generateHashes();