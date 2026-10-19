import { HttpStatus } from "../lib/status_code";
import type { Context } from "hono";
import { Hono } from "hono";
import { CustomerService } from "./customers.service";
import { HTTPException } from "hono/http-exception";
import { AuthMiddleware } from "../middleware/auth.middleware";
import type { UpdateCustomerRequest } from "./customers.model";
import { OwnerMiddleware } from "../middleware/owner.middleware";
import {
  getPagination,
  jsonCreated,
  jsonOK,
  jsonOk,
  jsonPaginated,
} from "../lib/response";

const CustomersController = new Hono();
CustomersController.use(AuthMiddleware);
CustomersController.post("/", async (c: Context) => {
  const body = await c.req.json();
  const data = await CustomerService.registerCustomer(body);
  return jsonCreated(c, data);
});

CustomersController.get("/", async (c: Context) => {
  const pg = getPagination(c);

  const data = await CustomerService.getAllCustomerPagination(pg.take, pg.page);
  return jsonPaginated(c, data);
});

CustomersController.get("/all", async (c: Context) => {
  const data = await CustomerService.getAllCustomer();
  return jsonOk(c, data);
});

CustomersController.get("/:id", async (c: Context) => {
  const id = c.req.param("id");
  if (!id || id === "") {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "Param undefined",
    });
  }
  const data = await CustomerService.getCustomerById(id);
  return jsonOK(c, data);
});

CustomersController.put("/:id", async (c: Context) => {
  const id = c.req.param("id");
  if (!id || id === "") {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "Param undefined",
    });
  }

  const body: UpdateCustomerRequest = await c.req.json();

  if (!body) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "Body undefined",
    });
  }

  const data = await CustomerService.updateCustomerById(id, body);
  return jsonOK(c, data);
});
CustomersController.use(OwnerMiddleware);
CustomersController.delete("/:id", async (c: Context) => {
  const id = c.req.param("id");
  if (!id) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "Param undefined",
    });
  }
  const data = await CustomerService.deleteCustomerById(id);

  return jsonOK(c, data);
});

export default CustomersController;
