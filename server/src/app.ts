import express, {
  Application,
  Request,
  RequestHandler,
  Response,
} from "express";
import cors from "cors";
import Multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { seedTables } from "./seed";
import { getLoginUser } from "./db";

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
  },
});

const options: cors.CorsOptions = {
  origin: "*",
};

const app: Application = express();
app.use(cors(options));
app.use(express.json() as RequestHandler);
app.use(express.urlencoded({ extended: true }) as RequestHandler);

const port: number = 8081;

app.get("/", (req: Request, res: Response) => {
  res.send({ hello: "there" });
});

app.get("/seed-db", async (req: Request, res: Response) => {
  try {
    const message = await seedTables();
    return res.status(200).json({ message });
  } catch (err) {
    return res.status(500).json({ err });
  }
});

app.post(
  "/register",
  multer.single("userImage"),
  async (req: Request, res: Response) => {
    const { email, userName, password } = req.body;

    if (!email || !password || !userName) {
      return res.status(400).json({ msg: "Missing required field" });
    }

    // check if ID already exists in DB
    const userByEmail = {};
    if (userByEmail) {
      return res.status(400).json({ msg: "The email already exists" });
    }
    // all good, store new user in firestore
    try {
      // store the user
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Unexpected error occurred" });
    }

    return res.status(200).json({ email, password });
  }
);

app.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Email or password is invalid" });
  }

  // check if user is in db
  const userByEmail = await getLoginUser(email);
  if (!userByEmail || userByEmail.password !== password) {
    return res.status(400).json({ msg: "ID or password is invalid" });
  }

  // dodgy way of removing the password from response
  return res
    .status(200)
    .json({ user: { ...userByEmail, password: undefined } });
});

app.get("/music", async (req, res) => {
  return res.sendStatus(200);
});

app.post("/:userId/:musicId/subscribe", async (req, res) => {
  return res.sendStatus(200);
});

app.post("/:userId/:musicId/unsubscribe", async (req, res) => {
  return res.sendStatus(200);
});

app.get("/:userId/subscriptions", async (req: Request, res: Response) => {
  try {
    const music = ["hi"];
    return res.status(200).json({ music });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Unexpected error occurred" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port} !`);
});
