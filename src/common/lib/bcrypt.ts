import * as bcrypt from "bcrypt";

const saltOrRounds = 10;

export async function hashed(data: string): Promise<string> {
  return await bcrypt.hash(data, saltOrRounds);
}