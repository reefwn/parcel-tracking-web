import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { validateRegister } from "../utils/validateRegister";
import { EmailPasswordInput } from "./EmailPasswordInput";
import { sendEmail } from "../utils/sendEmail";
import { User } from "../entities/User";
import { getConnection } from "typeorm";
import { MyContext } from "../types";
import argon2 from "argon2";
import { v4 } from "uuid";
import {
  Resolver,
  Ctx,
  Arg,
  Mutation,
  Field,
  Query,
  Int,
  ObjectType,
  FieldResolver,
  Root,
} from "type-graphql";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    if (req.session.userId === user.id) {
      return user.email;
    }
    return "";
  }

  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  user(@Arg("id", () => Int) id: number): Promise<User | undefined> {
    return User.findOne(id);
  }

  @Mutation(() => UserResponse)
  async createUser(
    @Arg("options", () => EmailPasswordInput) options: EmailPasswordInput
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }
    const hashsedPassword = await argon2.hash(options.password);
    let user;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          email: options.email.toLowerCase(),
          password: hashsedPassword,
        })
        .returning("*")
        .execute();
      user = result.raw[0];
    } catch (err) {
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "email",
              message: "email is already taken",
            },
          ],
        };
      }
    }
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options", () => EmailPasswordInput) options: EmailPasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({
      where: { email: options.email.toLowerCase() },
    });
    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "email doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    const userId = req.session.userId;
    if (!userId) {
      return null;
    }

    return User.findOne(userId);
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          resolve(false);
        }
        resolve(true);
      })
    );
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true;
    }

    const token = v4();
    const emailTemplate = `
<!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Reset Password Email Template</title>
    <meta name="description" content="Reset Password Email Template.">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                          <h1 style="color: #319795; margin-bottom: 0;">Parcel Tracking</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                            requested to reset your password</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            We cannot simply send you your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.
                                        </p>
                                        <a href="http://localhost:3000/reset-password/${token}" target="_blank"
                                            style="background:#319795;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                            Password</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.parcel-tracking.com</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>

</html>
    `;

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 30 // 30 minutes
    );

    sendEmail(email, "Reset Password", emailTemplate);

    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("newPassword") newPassword: string,
    @Arg("token") token: string,
    @Ctx() { req, redis }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length < 8) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be greater than 8",
          },
        ],
      };
    }

    console.log("newPassword", newPassword);
    console.log("token", token);
    const key = FORGET_PASSWORD_PREFIX + token;
    console.log("key", key);
    const userId = await redis.get(key);
    console.log("userId", userId);

    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token is expired",
          },
        ],
      };
    }

    const user = await User.findOne(userId);
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    await User.update(
      { id: parseInt(userId) },
      { password: await argon2.hash(newPassword) }
    );

    await redis.del(key);

    // login user after change password
    req.session.userId = user.id;

    return { user };
  }

  // @Mutation(() => User)
  // async upadateUser(
  //   @Arg("id", () => Int) id: number,
  //   @Arg("email", () => String, { nullable: true }) email: string,
  //   @Arg("password", () => String, { nullable: true }) password: string,
  //   @Ctx() ctx: MyContext
  // ): Promise<User | null> {
  //   const user = await ctx.em.findOne(User, { id });
  //   if (!user) {
  //     return null;
  //   }
  //   if (email) {
  //     user.email = email;
  //   }
  //   if (password) {
  //     user.password = password;
  //   }
  //   await ctx.em.persistAndFlush(user);
  //   return user;
  // }

  // @Mutation(() => Boolean)
  // async deleteUser(
  //   @Arg("id", () => Int) id: number,
  //   @Ctx() ctx: MyContext
  // ): Promise<boolean> {
  //   try {
  //     await ctx.em.nativeDelete(User, { id });
  //   } catch {
  //     return false;
  //   }
  //   return true;
  // }
}
