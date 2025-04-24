import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const POST = async (req, res) => {
  const { email, password } = await req.json();
  // console.log(email, password);
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    let user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      //Create new user if no user exists
      user = await prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
        },
      });
      // console.log(newUser);
    } else {
      const passwordValid = await bcrypt.compare(password, user.password); //check if password matches
      if (!passwordValid) {
        return new Response(JSON.stringify({ message: "Login Failed" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(
      JSON.stringify({ userDetails: user, message: "Login Succesfull" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ message: "Login Failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
