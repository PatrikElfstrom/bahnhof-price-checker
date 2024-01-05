// @deno-types="npm:@types/nodemailer"
export * as nodemailer from "npm:nodemailer";

export { load } from "https://deno.land/std@0.211.0/dotenv/mod.ts";

export {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.211.0/path/mod.ts";
