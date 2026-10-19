import { Hono, type Context } from "hono";
import { jsonOK } from "../lib/response";
import { AuthMiddleware } from "../middleware/auth.middleware";
import {
  type ChangeNameRequest,
  type JWT_RESPONSE,
  type LoginUserRequest,
  type RegisterUserRequest,
  type ResetPasswordRequest,
} from "./auth.model";
import { AuthService } from "./auth.service";

const AuthController = new Hono();
AuthController.post("/", async (c: Context) => {
  const body: RegisterUserRequest = await c.req.json();
  const result = await AuthService.register(body);
  return jsonOK(c, result);
});
AuthController.post("/login", async (c: Context) => {
  const body: LoginUserRequest = await c.req.json();
  const result = await AuthService.login(body, c);
  return jsonOK(c, result);
});
AuthController.use(AuthMiddleware);
AuthController.get("/me", async (c: Context) => {
  const result = await AuthService.me(c);
  return jsonOK(c, result);
});
AuthController.patch("/name", async (c: Context) => {
  const user: JWT_RESPONSE = c.get("user");
  const body: ChangeNameRequest = await c.req.json();
  await AuthService.changeName(c, user.email, body);
  return jsonOK(c, "Name changed successfully");
});
AuthController.patch("/current", async (c: Context) => {
  const user: JWT_RESPONSE = c.get("user");
  const body: ResetPasswordRequest = await c.req.json();
  await AuthService.resetPassword(body.password, user.email);
  return jsonOK(c, "Password changed successfully");
});
AuthController.delete("/current", async (c: Context) => {
  await AuthService.logout(c);
  return jsonOK(c, "Cookies cleared successfully");
});
AuthController.delete("/delete_account", async (c: Context) => {
  const user: JWT_RESPONSE = c.get("user");
  await AuthService.deleteAccount(user.email);
  return jsonOK(c, "Account deleted successfully");
});
export default AuthController;
