import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from 'bcrypt';

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const _filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(_filename);