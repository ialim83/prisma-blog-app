import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
  try {
    const adminData = {
      name: "userAdmin",
      email: "admin4@gmail.com",
      role: UserRole.ADMIN,
      password: "admin123",
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("user already exists.");
    }

    //  create the admin user in the database
    const signUpAdmin = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:4000",
        },
        body: JSON.stringify({
          name: adminData.name,
          email: adminData.email,
          password: adminData.password,
        }),
      },
    );

    const result = await signUpAdmin.json();

    // console.log("Status:", signUpAdmin.status);
    // console.log("Status:", signUpAdmin);
    // console.log("Response:", result);

    if (!signUpAdmin.ok) {
      throw new Error(`Admin signup failed: ${signUpAdmin.status}`);
    }

    await prisma.user.update({
      where: {
        email: adminData.email,
      },
      data: {
        role: UserRole.ADMIN,
        emailVerified: true,
      },
    });

    // console.log("verifiedUser", updatedUser);
  } catch (error) {
    console.error("Error occurred while seeding admin:", error);
  }
}

seedAdmin();
