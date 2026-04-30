import { Request, Response } from "express";

export type GraphQLContext = {
  req: Request;
  res: Response;
};

export async function buildContext({ req, res }: GraphQLContext): Promise<GraphQLContext> {
  return { req, res };
}
